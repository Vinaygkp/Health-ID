# 🏥 Health-ID - Universal Digital Health Identity

Health-iD is a secure, encrypted, and instantaneous digital health identity platform designed to provide quick medical access during emergencies worldwide.

---

## 🚀 Features

* **🔒 Secure Health ID Generation:** Generates a permanent, unique Health ID (e.g., `MS10001`) for every verified user.
* **⚡ Google Authentication:** Seamless login and registration using Passport.js Google OAuth 2.0.
* **🛡️ AES-256 & JWT Security:** High-level encryption and JSON Web Token (JWT) based authenticated routes.
* **📁 Cloudinary Integration:** Secure storage for medical reports, scans, and profile photos (supports PDF and images).
* **🤖 MediShield AI Assistant:** Powered by Google Gemini AI to provide empathetic clinical insights and health guidance.
* **🌐 Public Emergency Health Card:** Instant QR code-based public profile access for medical responders during emergencies.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router.
* **Backend:** Node.js, Express.js, TypeScript, Mongoose.
* **Database:** MongoDB.
* **Authentication:** Passport-Google-OAuth20, JWT, Express-Session.
* **File Uploads:** Multer & Cloudinary SDK.
* **AI Engine:** Google Generative AI SDK (`gemini-2.5-flash`).

---

## 📂 Project Structure

Design MediShield AI Application/
├── .gitignore                         <-- Root-level Gitignore file
├── Backend/
│   ├── dist/
│   ├── node_modules/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   └── user.ts
│   │   └── server.ts                  <-- Main Express & Passport Server
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── tmp_upload_test.png
│   └── tsconfig.json
│
└── Frontend/
    ├── .figma/
    ├── .vscode/
    ├── dist/
    ├── node_modules/
    ├── src/
    │   ├── components/
    │   │   ├── Breadcrumb.tsx
    │   │   ├── ConfirmModal.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── PageTransition.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Toast.tsx
    │   │   ├── UserAvatar.tsx
    │   │   └── WelcomeModal.tsx
    │   ├── contexts/
    │   ├── data/
    │   │   └── hospitalsData.ts
    │   ├── imports/
    │   │   └── pasted_text/
    │   │       └── global-website-reqs.md
    │   ├── pages/
    │   │   ├── AIChat.tsx
    │   │   ├── Contact.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── HealthCard.tsx
    │   │   ├── Home.tsx
    │   │   ├── HospitalDetails.tsx
    │   │   ├── Hospitals.tsx
    │   │   ├── LegalPage.tsx
    │   │   ├── LoadingScreen.tsx
    │   │   ├── Login.tsx
    │   │   ├── MedicalOverview.tsx
    │   │   ├── NotFound.tsx
    │   │   ├── Profile.tsx
    │   │   ├── PublicHealthCard.tsx
    │   │   ├── QRPage.tsx
    │   │   ├── Register.tsx
    │   │   ├── RegistrationSuccess.tsx
    │   │   └── Settings.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── .gitattributes
    ├── .gitignore
    ├── .mise.toml
    ├── AGENTS.md
    ├── CLAUDE.md
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    └── vite.config.ts