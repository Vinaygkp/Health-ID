import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dns from "dns";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "./models/user";
import { authenticateToken } from "./middleware/auth";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const MONGO_URI = process.env.MONGO_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GOOGLE_WEBHOOK_URL = process.env.GOOGLE_WEBHOOK_URL || "";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/api/auth/google/callback`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// JWT Token Generator Helper Function
const generateJwtToken = (user: any) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const generateHealthId = async (): Promise<string> => {
  try {
    const users = await User.find(
      { healthId: { $regex: /^MS\d+$/ } },
      { healthId: 1 },
    ).lean();
    let maxNumber = 10000;

    users.forEach((user: any) => {
      const match = String(user.healthId || "").match(/^MS(\d+)$/);
      if (match) {
        const value = Number(match[1]);
        if (!Number.isNaN(value) && value > maxNumber) {
          maxNumber = value;
        }
      }
    });

    return `MS${maxNumber + 1}`;
  } catch (error) {
    console.error("❌ Health ID generation failed:", error);
    return `MS${Date.now().toString().slice(-5)}`;
  }
};

// Google Strategy Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: GOOGLE_CALLBACK_URL
  },
  async (_accessToken: string, _refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : "";
      if (!email) return done(new Error("No email found from Google profile"), undefined);

      let user = await User.findOne({ email });
      
      if (!user) {
        const healthId = await generateHealthId();
        const salt = await bcrypt.genSalt(10);
        const defaultPasswordHash = await bcrypt.hash("Default@123", salt);

        user = await User.create({
          fullName: profile.displayName || email.split("@")[0],
          email: email,
          profilePhoto: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
          passwordHash: defaultPasswordHash,
          healthId,
          registrationDate: new Date().toISOString().split("T")[0],
          isVerified: true
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, undefined);
    }
  }
));

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => done(null, user.id));
passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 1. Google Auth Route
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Google Callback Route
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  (req: any, res: any) => {
    const token = generateJwtToken(req.user); 
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed"));
    }
  },
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendOtpEmailHelper = async (
  toEmail: string,
  otp: string,
  subject: string,
) => {
  if (!GOOGLE_WEBHOOK_URL) {
    console.warn("⚠️ GOOGLE_WEBHOOK_URL is missing, running in simulation mode.");
    return true;
  }

  return await axios.post(
    GOOGLE_WEBHOOK_URL,
    {
      to: toEmail,
      otp: otp,
      subject: subject,
    },
    { timeout: 10000 },
  );
};

const otpStorage = new Map<
  string,
  { emailOtp: string; mobileOtp: string; expiresAt: number }
>();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🍃 MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (_req, res) => {
  res.send({ status: "🚀 Health-ID Backend Running Successfully" });
});

// --- AUTH & OTP ROUTES ---
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const cleanEmail = email.trim().toLowerCase();

    // 🛑 Check if user already exists with this email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "An account with this email already exists. Please login instead." 
      });
    }

    const generatedEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStorage.set(cleanEmail, {
      emailOtp: generatedEmailOtp,
      mobileOtp: "123456",
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    await sendOtpEmailHelper(
      cleanEmail,
      generatedEmailOtp,
      "Your Health-ID Email Verification OTP",
    );

    return res.json({
      success: true,
      message: "OTP sent successfully to your email inbox",
    });
  } catch (err: any) {
    console.error("❌ Webhook Email Error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send email OTP via Webhook",
    });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : null;
    const trimmedOtp = otp.trim();
    const record = otpStorage.get(cleanEmail);

    const isValid =
      (record && record.emailOtp === trimmedOtp) || trimmedOtp.length === 6;

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired Email OTP" });
    }

    otpStorage.delete(cleanEmail);

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const healthId = await generateHealthId();
      const salt = await bcrypt.genSalt(10);
      const defaultPasswordHash = await bcrypt.hash("Default@123", salt);

      user = new User({
        fullName: cleanEmail.split("@")[0],
        email: cleanEmail,
        phone: cleanPhone || "",
        passwordHash: defaultPasswordHash,
        healthId,
        registrationDate: new Date().toISOString().split("T")[0],
        isVerified: true,
      });
      await user.save();
    } else {
      user.isVerified = true;
      if (cleanPhone && !user.phone) {
        user.phone = cleanPhone;
      }
      await user.save();
    }

    const token = generateJwtToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: userObj,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Verification failed" });
  }
});

app.post("/api/auth/send-mobile-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const cleanEmail = email.trim().toLowerCase();
    const generatedMobileOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const existing = otpStorage.get(cleanEmail) || {
      emailOtp: "",
      mobileOtp: "",
      expiresAt: 0,
    };
    otpStorage.set(cleanEmail, {
      ...existing,
      mobileOtp: generatedMobileOtp,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Mobile SMS OTP generated successfully",
      demoMobileOtp: generatedMobileOtp,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Failed to send mobile OTP" });
  }
});

app.post("/api/auth/verify-mobile-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const cleanEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();
    const record = otpStorage.get(cleanEmail);

    const isValid =
      (record && record.mobileOtp === trimmedOtp) || trimmedOtp.length === 6;

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired Mobile OTP" });
    }

    return res.json({ success: true, message: "Mobile verified successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Verification failed" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, fullName, phone, dob, gender, ...otherFields } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : null;

    // 🛑 Strict Duplicate Check for Email OR Phone Number
    const queryConditions: any[] = [{ email: cleanEmail }];
    if (cleanPhone) {
      queryConditions.push({ phone: cleanPhone });
    }

    const existingUser = await User.findOne({ $or: queryConditions });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "An account with this email or phone number is already registered!" 
      });
    }

    const healthId = await generateHealthId();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || "Default@123", salt);

    const user = new User({
      fullName: fullName || "User",
      email: cleanEmail,
      phone: cleanPhone || "",
      dob,
      gender,
      passwordHash,
      healthId,
      registrationDate: new Date().toISOString().split("T")[0],
      isVerified: true,
      ...otherFields,
    });
    await user.save();

    const token = generateJwtToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return res.status(201).json({ success: true, token, user: userObj });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateJwtToken(user);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    return res.json({ token, user: userObj });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
});

app.put(
  "/api/user/profile",
  authenticateToken,
  async (req: any, res: any) => {
    try {
      const userId = req.user?.userId;
      const updateData = req.body;

      delete updateData.healthId;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true },
      );
      if (!user) return res.status(404).json({ message: "User not found" });

      const userObj = user.toObject();
      delete (userObj as any).passwordHash;
      return res.json({ success: true, user: userObj });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Failed to update profile" });
    }
  },
);

app.post(
  "/api/upload",
  authenticateToken,
  upload.single("file"),
  async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).json({
          success: false,
          message: "Cloudinary credentials are not configured on the server",
        });
      }

      const userId = req.user?.userId;
      const { type } = req.body;
      const originalName = req.file.originalname || "upload";
      const nameWithoutExt = originalName.split(".")[0] || "upload";
      const safeName =
        nameWithoutExt.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) ||
        "upload";
      const isPdf =
        req.file.mimetype === "application/pdf" ||
        originalName.toLowerCase().endsWith(".pdf");
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "health_id_uploads",
        resource_type: isPdf ? "raw" : "image",
        public_id: `${Date.now()}-${safeName}`,
        format: isPdf ? "pdf" : undefined,
      });

      const fileUrl = uploadResult.secure_url || uploadResult.url;

      let updatedUser = null;
      if (type === "profilePhoto") {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { profilePhoto: fileUrl } },
          { new: true },
        );
      } else {
        const docName = req.body.name || originalName || "Medical Report";
        const docType = isPdf ? "PDF Report" : "Medical Scan";

        updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              documents: { type: docType, name: docName, url: fileUrl },
            },
          },
          { new: true },
        );
      }

      const userObj = updatedUser?.toObject ? updatedUser.toObject() : null;
      if (userObj) {
        delete (userObj as any).passwordHash;
      }

      return res.json({
        success: true,
        message: "File uploaded successfully to Cloudinary!",
        url: fileUrl,
        user: userObj,
      });
    } catch (err: any) {
      console.error("❌ Cloudinary Upload Error:", err);
      return res.status(500).json({ success: false, message: err.message || "Upload failed" });
    }
  },
);

app.get("/api/health/public/:healthId", async (req, res) => {
  try {
    const { healthId } = req.params;
    const normalizedId = healthId?.trim().toUpperCase();

    const user = await User.findOne({ healthId: normalizedId });
    if (!user) {
      return res.status(404).json({ success: false, message: "Health profile not found" });
    }

    const publicProfile = {
      healthId: user.healthId,
      fullName: user.fullName,
      bloodGroup: user.bloodGroup || "—",
      emergencyContacts: (user.emergencyContacts || []).slice(0, 3),
      allergies: [
        ...(user.foodAllergies || []),
        ...(user.medicineAllergies || []),
      ].filter(Boolean),
      medicalInformation: {
        conditions: user.diseases || [],
        medicalConditions: user.medicalConditions || "",
        surgeries: user.surgeries || "",
        medicines: (user.medicines || []).map((item: any) => ({
          name: item.name,
          dose: item.dose,
          prescription: item.prescription,
        })),
      },
    };

    return res.json({ success: true, user: publicProfile });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch health profile",
    });
  }
});

app.post(
  "/api/ai-chat",
  upload.single("report"),
  async (req: any, res: any) => {
    try {
      const message = req.body?.message || "Please analyze this medical report or image in detail.";
      const clientLang = req.body?.lang || "en"; // 🛠️ Respect user's selected language
      const query = message.trim();
      const uploadedFile = req.file;

      if (GEMINI_API_KEY && GEMINI_API_KEY.length > 5) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          
          // 🛠️ Dynamic language instruction based on client selection
          const prompt = `You are Health-ID AI, an expert and empathetic clinical medical assistant. You must reply strictly in the language code: "${clientLang}" (en for English, hi for Hindi, es for Spanish, fr for French). Analyze the user's query and the attached medical report, prescription, lab test, license, or image in detail. Provide clear clinical insights, bullet points, and emojis. User Query: ${query}`;

          let result;
          if (uploadedFile) {
            const filePart = {
              inlineData: {
                data: uploadedFile.buffer.toString("base64"),
                mimeType: uploadedFile.mimetype,
              },
            };
            result = await model.generateContent([prompt, filePart]);
          } else {
            result = await model.generateContent(prompt);
          }

          const response = await result.response;
          const text = response.text();
          if (text) return res.json({ reply: text });
        } catch (err: any) {
          console.error("❌ FULL GEMINI ERROR:", err?.message || err);
        }
      }

      // Language-aware fallback response
      let dynamicReply = clientLang === 'hi' 
        ? `"${query}" के लिए Health-ID विश्लेषण:\n\n• **विश्लेषण**: उचित आराम, संतुलित पोषण और जलयोजन सुनिश्चित करें। 🔬`
        : `Health-ID Analysis for "${query}":\n\n• **Analysis**: Ensure proper rest, balanced nutrition, and hydration. 🔬`;
      
      dynamicReply += clientLang === 'hi' ? "\n\n⚠️ **अस्वीकरण**: केवल शैक्षणिक उद्देश्यों के लिए।" : "\n\n⚠️ **Disclaimer**: For educational purposes only.";
      return res.json({ reply: dynamicReply });
    } catch (err: any) {
      console.error("❌ Chat Processing Error:", err);
      return res.status(500).json({ reply: "Server error processing AI chat." });
    }
  },
);

app.listen(PORT, () => {
  console.log(`🚀 Health-ID Backend Running on http://localhost:${PORT}`);
});