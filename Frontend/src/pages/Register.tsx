import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Stethoscope, AlertTriangle, Pill, Users, FileText, CheckSquare,
  ChevronLeft, ChevronRight, Upload, Plus, Trash2, Camera, Shield, Mail, KeyRound, CheckCircle2, Smartphone, Sparkles, Eye, EyeOff, ArrowLeft, RefreshCw, Fingerprint
} from 'lucide-react'
import { useAuth, type UserProfile } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STEPS = [
  { num: 1, label: 'Personal', icon: User },
  { num: 2, label: 'Medical', icon: Stethoscope },
  { num: 3, label: 'Allergies', icon: AlertTriangle },
  { num: 4, label: 'Medicines', icon: Pill },
  { num: 5, label: 'Emergency', icon: Users },
  { num: 6, label: 'Documents', icon: FileText },
  { num: 7, label: 'Aadhaar Verify', icon: Fingerprint },
  { num: 8, label: 'Review', icon: CheckSquare },
]

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const DISEASES = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Cancer', 'Epilepsy', 'Thyroid', 'Kidney Disease', 'Liver Disease']
const FOOD_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish']
const MED_ALLERGIES = ['Penicillin', 'Aspirin', 'Ibuprofen', 'Sulfa drugs', 'Codeine', 'NSAIDs']
const DOC_TYPES = ['Prescription', 'Blood Report', 'Insurance Card', 'Vaccination Record', 'Medical Certificate', 'Scan/X-Ray']
const RELATIONS = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Family Doctor', 'Caretaker', 'Other']

// Dependent Location Data Structure
const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  'India': {
    'Uttar Pradesh': ['Ghaziabad', 'Noida', 'Lucknow', 'Kanpur', 'Meerut', 'Agra', 'Varanasi', 'Prayagraj'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur']
  },
  'USA': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Albany', 'Rochester'],
    'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio']
  },
  'UK': {
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen']
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey']
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat']
  }
}

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+81', label: 'Japan (+81)' },
]

const FormField = ({ id, name, label, type = 'text', placeholder, value, onChange, helper, required }: {
  id: string; name: string; label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; helper?: string; required?: boolean
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
      {label}{required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner"
    />
    {helper && <p className="mt-1 text-[11px] text-purple-700 dark:text-slate-400">{helper}</p>}
  </div>
)

const FormSelect = ({ id, name, label, options, value, onChange, required, disabled }: {
  id: string; name: string; label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
      {label}{required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white disabled:opacity-50 shadow-inner"
    >
      <option value="" className="bg-white dark:bg-slate-900">Select {label}</option>
      {options.map(o => <option key={o} value={o} className="bg-white dark:bg-slate-900">{o}</option>)}
    </select>
  </div>
)

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${active
      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700/80 hover:border-slate-400'
      }`}
  >
    {label}
  </button>
)

export default function Register() {
  const navigate = useNavigate()
  const { register, sendOtp, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [phase, setPhase] = useState<'auth' | 'email-otp' | 'mobile-otp' | 'medical'>('auth')
  const [step, setStep] = useState(1)

  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  // OTP States
  const [emailOtpArr, setEmailOtpArr] = useState(['', '', '', '', '', ''])
  const [mobileOtpArr, setMobileOtpArr] = useState(['', '', '', '', '', ''])
  const emailInputRefs = useRef<HTMLInputElement[]>([])
  const mobileInputRefs = useRef<HTMLInputElement[]>([])

  const [demoMobileOtp, setDemoMobileOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Document Upload Target Type State
  const [selectedDocType, setSelectedDocType] = useState<string>('Medical Document')

  // Aadhaar Verification States
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [aadhaarOtp, setAadhaarOtp] = useState(['', '', '', '', '', ''])
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false)
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const aadhaarInputRefs = useRef<HTMLInputElement[]>([])

  // Timer States for Resend OTP
  const [timer, setTimer] = useState(120)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let interval: any = null
    if ((phase === 'email-otp' || phase === 'mobile-otp') && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [phase, timer])

  const startTimer = () => {
    setTimer(120)
    setCanResend(false)
  }

  const fileRef = useRef<HTMLInputElement>(null)
  const docFileRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<Partial<UserProfile & { password?: string }>>({
    profilePhoto: '',
    fullName: '', dob: '', gender: '', phone: '', email: '', address: '',
    country: '', state: '', district: '', pincode: '', nationality: 'Indian',
    bloodGroup: '', height: '', weight: '',
    diseases: [], medicalConditions: '', surgeries: '', disabilities: '', familyHistory: '', insurance: '',
    foodAllergies: [], medicineAllergies: [], dustAllergy: false, otherAllergies: '', allergySeverity: 'Mild',
    medicines: [],
    emergencyContacts: [{ name: '', relation: '', phone: '', whatsapp: '', email: '', priority: 1 }],
    documents: [],
  })

  const set = (field: string, val: unknown) => {
    setData(d => {
      const updated = { ...d, [field]: val }
      if (field === 'country') {
        updated.state = ''
        updated.district = ''
      } else if (field === 'state') {
        updated.district = ''
      }
      return updated
    })
  }

  const toggle = (field: 'diseases' | 'foodAllergies' | 'medicineAllergies', val: string) => {
    const arr = (data[field] as string[]) ?? []
    set(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  const validatePasswordStrength = (pwd: string) => {
    const minLength = pwd.length >= 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullPhone = `${countryCode} ${phoneNumber}`
    if (!data.fullName || !data.email || !phoneNumber || !password) {
      showToast('Please fill all required fields', 'error')
      return
    }

    if (!validatePasswordStrength(password)) {
      showToast('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.', 'error')
      return
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error')
      return
    }

    set('phone', fullPhone)

    setIsLoading(true)
    const res = await sendOtp(data.email!)
    setIsLoading(false)

    if (res.success) {
      showToast('Verification code sent to your email!', 'success')
      setPhase('email-otp')
      startTimer()
    } else {
      showToast(res.message || 'Failed to send Email OTP.', 'error')
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    if (phase === 'email-otp') {
      await sendOtp(data.email!)
      showToast('New Email OTP sent successfully!', 'success')
    } else if (phase === 'mobile-otp') {
      await fetch('http://localhost:5001/api/auth/send-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, phone: data.phone })
      })
      showToast('New Mobile SMS OTP sent successfully!', 'success')
    }
    setIsLoading(false)
    startTimer()
  }

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalEmailOtp = emailOtpArr.join('')
    if (finalEmailOtp.length < 6) {
      showToast('Please enter the complete 6-digit email OTP', 'error')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, otp: finalEmailOtp })
      })
      const resData = await response.json()

      if (resData.success) {
        const mobileRes = await fetch('http://localhost:5001/api/auth/send-mobile-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, phone: data.phone })
        })
        const mobileData = await mobileRes.json()

        if (mobileData.success) {
          if (mobileData.demoMobileOtp) setDemoMobileOtp(mobileData.demoMobileOtp)
          showToast('Email verified successfully! Mobile SMS OTP sent.', 'success')
          setPhase('mobile-otp')
          startTimer()
        } else {
          showToast('Failed to trigger mobile OTP', 'error')
        }
      } else {
        showToast(resData.message || 'Invalid or expired Email OTP', 'error')
      }
    } catch (err) {
      showToast('Network error during email verification', 'error')
    }
    setIsLoading(false)
  }

  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalMobileOtp = mobileOtpArr.join('')
    if (finalMobileOtp.length < 6) {
      showToast('Please enter the complete 6-digit mobile OTP', 'error')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:5001/api/auth/verify-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, otp: finalMobileOtp })
      })
      const resData = await res.json()

      if (resData.success) {
        await register({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: password,
        } as Partial<UserProfile>)

        showToast('Mobile verified & Account created! Now complete your medical profile.', 'success')
        setPhase('medical')
        setStep(1)
      } else {
        showToast(resData.message || 'Invalid Mobile OTP', 'error')
      }
    } catch (err) {
      showToast('Network error verifying mobile OTP', 'error')
    }
    setIsLoading(false)
  }

  const handleSendAadhaarOtp = () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      showToast('Please enter a valid 12-digit Aadhaar number', 'error')
      return
    }
    setIsAadhaarOtpSent(true)
    showToast('Aadhaar OTP sent to registered mobile number (Demo OTP: 123456)', 'success')
  }

  const handleVerifyAadhaarOtp = () => {
    const finalOtp = aadhaarOtp.join('')
    if (finalOtp.length < 6) {
      showToast('Please enter complete 6-digit Aadhaar OTP', 'error')
      return
    }

    const maskedAadhaar = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`
    setData(d => ({
      ...d,
      aadhaarNumber: maskedAadhaar,
      isAadhaarVerified: true
    }))

    setIsAadhaarVerified(true)
    showToast('Aadhaar Verified Successfully! You can now generate your Health ID.', 'success')
    setStep(8)
  }

  const handleFinalSubmit = async () => {
    if (!isAadhaarVerified) {
      showToast('Aadhaar verification is mandatory to generate Health ID', 'error')
      setStep(7)
      return
    }
    await updateProfile(data as UserProfile)
    showToast('Medical Profile Completed & Health ID Generated Successfully!', 'success')
    navigate('/register/success')
  }

  const next = () => {
    if (step === 7 && !isAadhaarVerified) {
      showToast('Please complete Aadhaar verification first!', 'error')
      return
    }
    if (step < 8) setStep(s => s + 1)
    showToast('Progress saved', 'info')
  }

  const prev = () => setStep(s => s - 1)

  const handleGlobalBack = () => {
    if (phase === 'medical') {
      if (step > 1) {
        setStep(s => s - 1)
      }
    } else if (phase === 'mobile-otp') {
      setPhase('email-otp')
      startTimer()
    } else if (phase === 'email-otp') {
      setPhase('auth')
    }
  }

  const handleOtpChange = (val: string, index: number, type: 'email' | 'mobile' | 'aadhaar') => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1)
    if (type === 'email') {
      const newArr = [...emailOtpArr]
      newArr[index] = digit
      setEmailOtpArr(newArr)
      if (digit && index < 5) emailInputRefs.current[index + 1]?.focus()
    } else if (type === 'mobile') {
      const newArr = [...mobileOtpArr]
      newArr[index] = digit
      setMobileOtpArr(newArr)
      if (digit && index < 5) mobileInputRefs.current[index + 1]?.focus()
    } else if (type === 'aadhaar') {
      const newArr = [...aadhaarOtp]
      newArr[index] = digit
      setAadhaarOtp(newArr)
      if (digit && index < 5) aadhaarInputRefs.current[index + 1]?.focus()
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDocs = Array.from(files).map((f) => ({
      type: selectedDocType,
      name: f.name,
      url: URL.createObjectURL(f),
    }))

    set('documents', [...(data.documents || []), ...newDocs])
    showToast(`1 ${selectedDocType} uploaded successfully`, 'success')
    e.target.value = ''
  }

  const triggerUploadForType = (docType: string) => {
    setSelectedDocType(docType)
    docFileRef.current?.click()
  }

  const handleGoogleSignup = () => {
    showToast('Redirecting to Google Authentication...', 'info')
    window.location.href = 'http://localhost:5001/api/auth/google'
  }

  const availableStates = data.country ? Object.keys(LOCATION_DATA[data.country] || {}) : []
  const availableDistricts = (data.country && data.state) ? (LOCATION_DATA[data.country]?.[data.state] || []) : []

  return (
    <div
      className="min-h-screen bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white flex flex-col relative overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Navbar />

      <main className="flex-1 py-28 px-4 lg:px-8 max-w-3xl mx-auto w-full relative z-10">

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none bg-gradient-to-tr from-emerald-500 to-purple-500 blur-[120px]" />

        {phase !== 'auth' && phase !== 'medical' && (
          <button
            type="button"
            onClick={handleGlobalBack}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={15} /> Back to {phase === 'mobile-otp' ? 'Email Verification' : 'Registration'}
          </button>
        )}

        <div className="text-center mb-10 animate-fadeInUp">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 shadow-xl shadow-emerald-500/25 text-white font-black text-xl tracking-tighter">
            HI
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-amber-600 dark:text-white font-jakarta">
            Create Your HealthID
          </h1>
          <p className="text-xs sm:text-sm text-purple-700 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles size={14} className="text-amber-500" />
            {phase === 'auth' && 'Step 1: Secure Account Setup & Credentials'}
            {phase === 'email-otp' && 'Step 2: Email Verification (OTP)'}
            {phase === 'mobile-otp' && 'Step 3: Mobile SMS Verification (OTP)'}
            {phase === 'medical' && `Step 4: Medical Profile Setup (${step} of ${STEPS.length} — ${STEPS[step - 1].label})`}
          </p>
        </div>

        {/* PHASE 1: ACCOUNT DETAILS & PASSWORD SETUP */}
        {phase === 'auth' && (
          <div
            className="p-8 sm:p-10 animate-fadeInUp max-w-xl mx-auto shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
          >
            <h2 className="text-xl font-black mb-6 flex items-center gap-2.5 text-amber-600 dark:text-white font-jakarta">
              <User size={22} className="text-indigo-600 dark:text-indigo-400" /> Basic Registration
            </h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <FormField
                id="fullName"
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={data.fullName ?? ''}
                onChange={v => set('fullName', v)}
                required
              />
              <FormField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={data.email ?? ''}
                onChange={v => set('email', v)}
                required
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
                  Mobile Number <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="w-32 px-3 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white cursor-pointer shadow-inner"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900">
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
                  Set Password <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 pr-12 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(o => !o)}
                    className="absolute right-4 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer z-10"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-purple-700 dark:text-slate-400 font-medium">
                  Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
                  Confirm Password <span className="text-rose-500 ml-1">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPw ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 pr-12 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(o => !o)}
                    className="absolute right-4 p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer z-10"
                  >
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 mt-6 flex items-center justify-center gap-2 text-sm font-black shadow-lg shadow-emerald-500/25 cursor-pointer rounded-2xl transition-all hover:scale-[1.02]">
                {isLoading ? 'Processing...' : 'Proceed to Email Verification'} <Mail size={16} />
              </button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <span className="relative px-4 text-[10px] font-extrabold uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-400">
                Or sign up with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.36 7.24 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.09-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        )}

        {/* PHASE 2: EMAIL OTP VERIFICATION */}
        {phase === 'email-otp' && (
          <div
            className="p-8 sm:p-10 animate-fadeInUp max-w-md mx-auto text-center shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <KeyRound size={26} />
            </div>
            <h2 className="text-xl font-black mb-2 text-amber-600 dark:text-white font-jakarta">Verify Your Email</h2>
            <p className="text-xs sm:text-sm mb-6 text-purple-700 dark:text-slate-400 font-medium">
              We sent a 6-digit verification code to <span className="font-semibold text-slate-900 dark:text-white">{data.email}</span>
            </p>

            <form onSubmit={handleVerifyEmailOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {emailOtpArr.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { if (el) emailInputRefs.current[idx] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, idx, 'email')}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        emailInputRefs.current[idx - 1]?.focus()
                      }
                    }}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-inner"
                  />
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-medium">
                {!canResend ? (
                  <span>Resend OTP in <strong className="text-indigo-600 dark:text-indigo-400">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</strong></span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                    <RefreshCw size={13} /> Resend OTP Code
                  </button>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 flex items-center justify-center gap-2 text-sm font-black shadow-lg shadow-emerald-500/25 cursor-pointer rounded-2xl transition-all hover:scale-[1.02]">
                {isLoading ? 'Verifying...' : 'Verify Email & Next'} <CheckCircle2 size={16} />
              </button>
            </form>
          </div>
        )}

        {/* PHASE 3: MOBILE SMS OTP VERIFICATION */}
        {phase === 'mobile-otp' && (
          <div
            className="p-8 sm:p-10 animate-fadeInUp max-w-md mx-auto text-center shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Smartphone size={26} />
            </div>
            <h2 className="text-xl font-black mb-2 text-amber-600 dark:text-white font-jakarta">Verify Mobile Number</h2>
            <p className="text-xs sm:text-sm mb-6 text-purple-700 dark:text-slate-400 font-medium">
              We sent an SMS OTP code to your mobile <span className="font-semibold text-slate-900 dark:text-white">{data.phone}</span>
            </p>

            {demoMobileOtp && (
              <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-mono font-bold">
                DEMO SMS OTP: <strong>{demoMobileOtp}</strong>
              </div>
            )}

            <form onSubmit={handleVerifyMobileOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {mobileOtpArr.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { if (el) mobileInputRefs.current[idx] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, idx, 'mobile')}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        mobileInputRefs.current[idx - 1]?.focus()
                      }
                    }}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-inner"
                  />
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-medium">
                {!canResend ? (
                  <span>Resend OTP in <strong className="text-emerald-600 dark:text-emerald-400">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</strong></span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                    <RefreshCw size={13} /> Resend SMS Code
                  </button>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 flex items-center justify-center gap-2 text-sm font-black shadow-lg shadow-emerald-500/25 cursor-pointer rounded-2xl transition-all hover:scale-[1.02]">
                {isLoading ? 'Verifying...' : 'Verify Mobile & Complete Setup'} <CheckCircle2 size={16} />
              </button>
            </form>
          </div>
        )}

        {/* PHASE 4: MULTI-STEP MEDICAL PROFILE DETAILS */}
        {phase === 'medical' && (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-3 overflow-x-auto gap-2 pb-2">
                {STEPS.map((s) => {
                  const Icon = s.icon
                  const done = s.num < step
                  const active = s.num === step
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => s.num < step && setStep(s.num)}
                      className={`flex flex-col items-center gap-1.5 min-w-[65px] transition-all ${s.num <= step ? 'cursor-pointer' : 'cursor-default opacity-40'}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${active
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${active ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                        {s.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 shadow"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Form Card */}
            <div
              className="p-6 sm:p-10 animate-fadeInUp shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
            >
              {/* STEP 1: PERSONAL */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Personal Details</h2>

                  <div className="flex items-center gap-6">
                    <div
                      className="w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer shrink-0 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-colors shadow-inner"
                      onClick={() => fileRef.current?.click()}
                    >
                      {data.profilePhoto ? (
                        <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Camera size={22} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-400">Upload</span>
                        </div>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = ev => set('profilePhoto', ev.target?.result as string)
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-1 text-slate-800 dark:text-white">Profile Photo</p>
                      <p className="text-xs mb-3 text-slate-500 dark:text-slate-400 font-medium">JPG or PNG, max 5MB</p>
                      <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm">
                        <Upload size={13} /> Choose File
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField id="dob" name="dob" label="Date of Birth" type="date" value={data.dob ?? ''} onChange={v => set('dob', v)} required />
                    <FormSelect id="gender" name="gender" label="Gender" options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} value={data.gender ?? ''} onChange={v => set('gender', v)} required />
                    <FormSelect id="nationality" name="nationality" label="Nationality" options={['Indian', 'American', 'British', 'Canadian', 'Australian', 'Other']} value={data.nationality ?? ''} onChange={v => set('nationality', v)} />
                    <FormField id="address" name="address" label="Address" placeholder="Enter your full address" value={data.address ?? ''} onChange={v => set('address', v)} />

                    <FormSelect
                      id="country"
                      name="country"
                      label="Country"
                      options={Object.keys(LOCATION_DATA)}
                      value={data.country ?? ''}
                      onChange={v => set('country', v)}
                      required
                    />

                    <FormSelect
                      id="state"
                      name="state"
                      label="State"
                      options={availableStates}
                      value={data.state ?? ''}
                      onChange={v => set('state', v)}
                      required
                      disabled={!data.country}
                    />

                    <FormSelect
                      id="district"
                      name="district"
                      label="District"
                      options={availableDistricts}
                      value={data.district ?? ''}
                      onChange={v => set('district', v)}
                      disabled={!data.state}
                    />

                    <FormField id="pincode" name="pincode" label="Pincode" placeholder="Enter 6-digit pincode" value={data.pincode ?? ''} onChange={v => set('pincode', v)} />
                  </div>
                </div>
              )}

              {/* STEP 2: MEDICAL */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Medical Information</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormSelect id="bloodGroup" name="bloodGroup" label="Blood Group" options={BLOOD_GROUPS} value={data.bloodGroup ?? ''} onChange={v => set('bloodGroup', v)} required />
                    <FormField id="height" name="height" label="Height (cm)" type="number" placeholder="Enter height in cm" value={data.height ?? ''} onChange={v => set('height', v)} />
                    <FormField id="weight" name="weight" label="Weight (kg)" type="number" placeholder="Enter weight in kg" value={data.weight ?? ''} onChange={v => set('weight', v)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 text-amber-600 dark:text-slate-300">Diseases / Conditions</label>
                    <div className="flex flex-wrap gap-2">
                      {DISEASES.map(d => (
                        <Chip key={d} label={d} active={(data.diseases ?? []).includes(d)} onClick={() => toggle('diseases', d)} />
                      ))}
                    </div>
                  </div>
                  <FormField id="medicalConditions" name="medicalConditions" label="Other Medical Conditions" placeholder="Enter any other medical conditions" value={data.medicalConditions ?? ''} onChange={v => set('medicalConditions', v)} />
                  <FormField id="surgeries" name="surgeries" label="Past Surgeries" placeholder="Enter past surgeries if any" value={data.surgeries ?? ''} onChange={v => set('surgeries', v)} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormSelect id="hasDisability" name="hasDisability" label="Disabilities (Yes / No)" options={['No', 'Yes']} value={data.disabilities ? 'Yes' : 'No'} onChange={v => set('disabilities', v === 'Yes' ? 'Has Disability' : '')} />
                    <FormSelect id="hasFamilyHistory" name="hasFamilyHistory" label="Family Medical History (Yes / No)" options={['No', 'Yes']} value={data.familyHistory ? 'Yes' : 'No'} onChange={v => set('familyHistory', v === 'Yes' ? 'Has History' : '')} />
                  </div>

                  <FormField id="insurance" name="insurance" label="Health Insurance" placeholder="Enter health insurance details" value={data.insurance ?? ''} onChange={v => set('insurance', v)} />
                </div>
              )}

              {/* STEP 3: ALLERGIES */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Allergies & Sensitivities</h2>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 text-amber-600 dark:text-slate-300">Food Allergies</label>
                    <div className="flex flex-wrap gap-2">
                      {FOOD_ALLERGIES.map(a => (
                        <Chip key={a} label={a} active={(data.foodAllergies ?? []).includes(a)} onClick={() => toggle('foodAllergies', a)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 text-amber-600 dark:text-slate-300">Medicine Allergies</label>
                    <div className="flex flex-wrap gap-2">
                      {MED_ALLERGIES.map(a => (
                        <Chip key={a} label={a} active={(data.medicineAllergies ?? []).includes(a)} onClick={() => toggle('medicineAllergies', a)} />
                      ))}
                    </div>
                  </div>

                  <FormSelect
                    id="dustAllergy"
                    name="dustAllergy"
                    label="Dust / Environmental Allergy"
                    options={['No', 'Yes']}
                    value={data.dustAllergy ? 'Yes' : 'No'}
                    onChange={v => set('dustAllergy', v === 'Yes')}
                  />

                  <FormField id="otherAllergies" name="otherAllergies" label="Other Allergies" placeholder="Enter other allergies" value={data.otherAllergies ?? ''} onChange={v => set('otherAllergies', v)} />
                  <FormSelect id="allergySeverity" name="allergySeverity" label="Allergy Severity" options={['Mild', 'Moderate', 'Severe', 'Life-threatening (Anaphylaxis)']} value={data.allergySeverity ?? 'Mild'} onChange={v => set('allergySeverity', v)} />
                </div>
              )}

              {/* STEP 4: MEDICINES */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Current Medicines</h2>
                    <button type="button" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
                      onClick={() => set('medicines', [...(data.medicines ?? []), { name: '', dose: '', morning: false, afternoon: false, night: false, prescription: '' }])}>
                      <Plus size={14} /> Add Medicine
                    </button>
                  </div>
                  {(data.medicines ?? []).length === 0 && (
                    <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700">
                      <Pill size={36} className="mx-auto mb-3 opacity-30 text-indigo-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No medicines added yet. Click "Add Medicine" to begin.</p>
                    </div>
                  )}
                  {(data.medicines ?? []).map((med, i) => (
                    <div key={i} className="p-5 rounded-2xl space-y-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Medicine #{i + 1}</span>
                        <button type="button" onClick={() => set('medicines', (data.medicines ?? []).filter((_, j) => j !== i))} className="text-rose-500 hover:opacity-80 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input placeholder="Enter medicine name" value={med.name} onChange={e => {
                          const arr = [...(data.medicines ?? [])]
                          arr[i] = { ...arr[i], name: e.target.value }
                          set('medicines', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                        <input placeholder="Enter dose (e.g. 500mg)" value={med.dose} onChange={e => {
                          const arr = [...(data.medicines ?? [])]
                          arr[i] = { ...arr[i], dose: e.target.value }
                          set('medicines', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                      </div>
                      <div className="flex gap-6 pt-1">
                        {(['morning', 'afternoon', 'night'] as const).map(time => (
                          <label key={time} className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 dark:text-slate-300">
                            <input type="checkbox" checked={med[time]} onChange={e => {
                              const arr = [...(data.medicines ?? [])]
                              arr[i] = { ...arr[i], [time]: e.target.checked }
                              set('medicines', arr)
                            }} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700" />
                            <span className="capitalize">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 5: EMERGENCY CONTACTS */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Emergency Contacts</h2>
                    <button type="button" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
                      onClick={() => set('emergencyContacts', [...(data.emergencyContacts ?? []), { name: '', relation: '', phone: '', whatsapp: '', email: '', priority: (data.emergencyContacts?.length ?? 0) + 1 }])}>
                      <Plus size={14} /> Add Contact
                    </button>
                  </div>
                  {(data.emergencyContacts ?? []).map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl space-y-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Contact #{i + 1} — Priority {c.priority}</span>
                        {i > 0 && (
                          <button type="button" onClick={() => set('emergencyContacts', (data.emergencyContacts ?? []).filter((_, j) => j !== i))} className="text-rose-500 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input placeholder="Enter contact full name" value={c.name} onChange={e => {
                          const arr = [...(data.emergencyContacts ?? [])]
                          arr[i] = { ...arr[i], name: e.target.value }
                          set('emergencyContacts', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                        <select value={c.relation} onChange={e => {
                          const arr = [...(data.emergencyContacts ?? [])]
                          arr[i] = { ...arr[i], relation: e.target.value }
                          set('emergencyContacts', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white">
                          <option value="" className="bg-white dark:bg-slate-900">Select Relation</option>
                          {RELATIONS.map(r => <option key={r} value={r} className="bg-white dark:bg-slate-900">{r}</option>)}
                        </select>
                        <input placeholder="Enter phone number" value={c.phone} onChange={e => {
                          const arr = [...(data.emergencyContacts ?? [])]
                          arr[i] = { ...arr[i], phone: e.target.value }
                          set('emergencyContacts', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                        <input placeholder="Enter WhatsApp number" value={c.whatsapp} onChange={e => {
                          const arr = [...(data.emergencyContacts ?? [])]
                          arr[i] = { ...arr[i], whatsapp: e.target.value }
                          set('emergencyContacts', arr)
                        }} className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                        <input placeholder="Enter email address" value={c.email} type="email" onChange={e => {
                          const arr = [...(data.emergencyContacts ?? [])]
                          arr[i] = { ...arr[i], email: e.target.value }
                          set('emergencyContacts', arr)
                        }} className="w-full sm:col-span-2 px-4 py-3 text-sm bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 6: DOCUMENTS */}
              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Medical Documents (PDF / Images)</h2>

                  <input
                    ref={docFileRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleDocumentUpload}
                  />

                  <div
                    onClick={() => triggerUploadForType('Medical Document')}
                    className="rounded-3xl p-8 text-center border-2 border-dashed cursor-pointer hover:border-emerald-500 transition-colors bg-slate-50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700"
                  >
                    <Upload size={36} className="mx-auto mb-3 opacity-40 text-slate-400" />
                    <p className="font-bold mb-1 text-slate-800 dark:text-white">Click or Drag & Drop PDF / Image files here</p>
                    <p className="text-xs mb-4 text-slate-500 dark:text-slate-400">PDF, JPG, PNG — Max 10MB each</p>
                    <button type="button" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-6 font-bold rounded-xl cursor-pointer shadow-sm">Browse Files</button>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Choose Document Type to Add (Requires File Selection)</p>
                    <div className="flex flex-wrap gap-2">
                      {DOC_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => triggerUploadForType(t)}
                          className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
                        >
                          <Plus size={12} /> + {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(data.documents ?? []).length > 0 && (
                    <div className="space-y-2.5 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Uploaded Documents ({data.documents?.length})</p>
                      {(data.documents ?? []).map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                          <FileText size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="text-xs sm:text-sm flex-1 truncate font-medium text-slate-800 dark:text-white">{doc.name}</span>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">{doc.type}</span>
                          <button type="button" onClick={() => set('documents', (data.documents ?? []).filter((_, j) => j !== i))} className="text-rose-500 cursor-pointer">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: AADHAAR VERIFICATION */}
              {step === 7 && (
                <div className="space-y-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                    <Fingerprint size={26} />
                  </div>
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Identity Verification</h2>
                  <p className="text-xs sm:text-sm text-purple-700 dark:text-slate-400 font-medium">
                    Government regulations require identity verification before generating a verified secure Medical HealthID.
                  </p>

                  {!isAadhaarVerified ? (
                    <div className="space-y-4 max-w-md mx-auto text-left">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-600 dark:text-slate-300">
                          Enter 12-Digit ID Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="Enter 12-digit ID number"
                          value={aadhaarNumber}
                          onChange={e => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          disabled={isAadhaarOtpSent}
                          className="w-full px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 tracking-widest font-mono shadow-inner"
                        />
                      </div>

                      {!isAadhaarOtpSent ? (
                        <button
                          type="button"
                          onClick={handleSendAadhaarOtp}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-sm font-black rounded-xl cursor-pointer shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                        >
                          Send Verification OTP
                        </button>
                      ) : (
                        <div className="space-y-4 pt-2">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">OTP sent to registered mobile number. (Demo OTP: 123456)</p>
                          <div className="flex justify-center gap-2">
                            {aadhaarOtp.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={el => { if (el) aadhaarInputRefs.current[idx] = el }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(e.target.value, idx, 'aadhaar')}
                                onKeyDown={e => {
                                  if (e.key === 'Backspace' && !digit && idx > 0) {
                                    aadhaarInputRefs.current[idx - 1]?.focus()
                                  }
                                }}
                                className="w-11 h-14 text-center text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-inner"
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyAadhaarOtp}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-sm font-black rounded-xl cursor-pointer shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                          >
                            Verify OTP & Proceed
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-2">
                      <CheckCircle2 size={36} className="mx-auto" />
                      <p className="font-bold text-base">Identity Verified Successfully!</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Your identity has been authenticated. Click Next to review and generate your HealthID card.</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 8 — Review & Submit */}
              {step === 8 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">Review & Submit</h2>

                  <div className="p-5 rounded-3xl space-y-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md">
                        {data.profilePhoto ? (
                          <img src={data.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          data.fullName?.[0] ?? 'U'
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-base text-slate-900 dark:text-white">{data.fullName || 'Your Name'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{data.email} • {data.phone}</p>
                      </div>
                    </div>
                    {[
                      ['Blood Group', data.bloodGroup],
                      ['Height / Weight', `${data.height || '—'} cm / ${data.weight || '—'} kg`],
                      ['Diseases', (data.diseases ?? []).join(', ') || 'None'],
                      ['Allergies', [...(data.foodAllergies ?? []), ...(data.medicineAllergies ?? [])].join(', ') || 'None'],
                      ['Medicines', (data.medicines ?? []).map(m => m.name).filter(Boolean).join(', ') || 'None'],
                      ['Emergency Contacts', `${(data.emergencyContacts ?? []).length} contacts`],
                      ['Documents', `${(data.documents ?? []).length} uploaded`],
                      ['Verification Status', isAadhaarVerified ? 'Verified ✓' : 'Pending ✗'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-2 text-xs sm:text-sm border-b border-slate-200 dark:border-slate-800 last:border-0">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{k}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{v || '—'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/20">
                    <Shield size={18} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs sm:text-sm font-medium text-purple-700 dark:text-slate-300">
                      By submitting, you agree that your medical data will be fully encrypted and stored securely under HIPAA standards.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!isAadhaarVerified}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-sm font-black flex justify-center items-center gap-2 shadow-xl shadow-emerald-500/25 rounded-2xl cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02]"
                  >
                    Generate HealthID & QR Code ✨
                  </button>
                </div>
              )}

              {/* Navigation */}
              {step < 8 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/80">
                  <button type="button" onClick={prev} disabled={step === 1} className="disabled:opacity-40 flex items-center gap-1 text-xs font-bold rounded-xl py-3 px-5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-sm" style={{ display: step === 1 ? 'none' : undefined }}>
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <div className="flex-1" />
                  <button type="button" onClick={next} className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 text-xs font-black shadow-md shadow-emerald-500/25 rounded-xl py-3 px-6 cursor-pointer transition-all hover:scale-105">
                    Next Step <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}