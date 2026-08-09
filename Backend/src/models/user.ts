import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  dob: string
  gender: string
  phone: string
  email: string
  passwordHash: string
  address: string
  country: string
  state: string
  district: string
  pincode: string
  nationality: string
  bloodGroup: string
  height: string
  weight: string
  diseases: string[]
  medicalConditions: string
  surgeries: string
  disabilities: string
  familyHistory: string
  insurance: string
  foodAllergies: string[]
  medicineAllergies: string[]
  dustAllergy: boolean
  otherAllergies: string
  allergySeverity: string
  medicines: Array<{
    name: string
    dose: string
    morning: boolean
    afternoon: boolean
    night: boolean
    prescription: string
  }>
  emergencyContacts: Array<{
    name: string
    relation: string
    phone: string
    whatsapp: string
    email: string
    priority: number
  }>
  documents: Array<{
    type: string
    name: string
    url: string
  }>
  healthId: string
  profilePhoto?: string
  registrationDate: string
  // Verification attributes
  isVerified?: boolean
  isMobileVerified?: boolean
  // Aadhaar Verification attributes
  aadhaarNumber?: string
  isAadhaarVerified?: boolean
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, default: 'User' },
    dob: { type: String, default: '2004-01-01' },
    gender: { type: String, default: 'Male' },
    phone: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    address: { type: String, default: '' },
    country: { type: String, default: 'India' },
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    pincode: { type: String, default: '' },
    nationality: { type: String, default: 'Indian' },
    bloodGroup: { type: String, default: 'A+' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    diseases: [{ type: String }],
    medicalConditions: { type: String, default: '' },
    surgeries: { type: String, default: '' },
    disabilities: { type: String, default: '' },
    familyHistory: { type: String, default: '' },
    insurance: { type: String, default: '' },
    foodAllergies: [{ type: String }],
    medicineAllergies: [{ type: String }],
    dustAllergy: { type: Boolean, default: false },
    otherAllergies: { type: String, default: '' },
    allergySeverity: { type: String, default: 'Low' },
    medicines: [
      {
        name: String,
        dose: String,
        morning: Boolean,
        afternoon: Boolean,
        night: Boolean,
        prescription: String,
      },
    ],
    emergencyContacts: [
      {
        name: String,
        relation: String,
        phone: String,
        whatsapp: String,
        email: String,
        priority: Number,
      },
    ],
    documents: [
      {
        type: { type: String },
        name: String,
        url: String,
      },
    ],
    healthId: { type: String, unique: true, index: true },
    profilePhoto: { type: String, default: '' },
    registrationDate: { type: String, required: true },
    // Verification Status Fields
    isVerified: { type: Boolean, default: true },
    isMobileVerified: { type: Boolean, default: true },
    // Aadhaar Verification Fields
    aadhaarNumber: { type: String, default: '' },
    isAadhaarVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)