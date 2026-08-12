import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// 🌐 Dynamic API Base URL with fallback to your backend port
const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Login() {
  const navigate = useNavigate()
  const { login, sendOtp, verifyOtp } = useAuth()
  const { showToast } = useToast()

  // Login Method Toggle: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // UI States
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form Validation
  const validatePasswordLogin = () => {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateOtpEmail = () => {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // 🔑 Password Login Submit
  const handlePasswordLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validatePasswordLogin()) return

    setLoading(true)
    const ok = await login(email.trim(), password)
    setLoading(false)

    if (ok) {
      showToast('Welcome back! Redirecting to dashboard...', 'success')
      navigate('/dashboard')
    } else {
      showToast('Invalid email or password. Please try again.', 'error')
    }
  }

  // 📩 Request OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validateOtpEmail()) return

    setLoading(true)
    const res = await sendOtp(email.trim())
    setLoading(false)

    if (res.success) {
      setOtpSent(true)
      showToast('Verification OTP sent to your email!', 'success')
    } else {
      showToast(res.message || 'Failed to send OTP. Make sure you are registered.', 'error')
    }
  }

  // 📲 Verify OTP Submit
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!otpInput || otpInput.trim().length < 6) {
      showToast('Please enter valid 6-digit OTP', 'error')
      return
    }

    setLoading(true)
    const ok = await verifyOtp(email.trim(), otpInput.trim())
    setLoading(false)

    if (ok) {
      showToast('OTP verified successfully! Redirecting...', 'success')
      navigate('/dashboard')
    } else {
      showToast('Invalid or expired OTP', 'error')
    }
  }

  // 🛠️ Fixed Google Login Handler
  const handleGoogleLogin = () => {
    const baseServerUrl = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;
    window.location.href = `${baseServerUrl}/api/auth/google`;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white overflow-x-hidden relative transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-28 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none bg-gradient-to-tr from-emerald-500 to-purple-500 blur-[120px]" />

        <div className="w-full max-w-md animate-fadeInUp relative z-10">
          <div
            className="p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
          >

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white font-black text-lg tracking-tighter">
                HI
              </div>
              <h1 className="text-2xl font-black tracking-tight mb-2 text-amber-600 dark:text-white font-jakarta">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-purple-700 dark:text-slate-400 font-medium">
                Sign in to access your secure HealthID pass
              </p>
            </div>

            {/* Login Method Toggle (Password vs OTP) */}
            <div className="flex rounded-2xl p-1 mb-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setErrors({}); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${loginMethod === 'password'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); setErrors({}); setOtpSent(false); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${loginMethod === 'otp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                OTP Quick Login
              </button>
            </div>

            {/* PASSWORD LOGIN FORM */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-slate-400 mb-2" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={errors.email ? { borderColor: '#ef4444' } : {}}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-slate-400" htmlFor="login-password">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-bold hover:underline text-indigo-600 dark:text-indigo-400">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="login-password"
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full px-4 pr-12 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={errors.password ? { borderColor: '#ef4444' } : {}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((o) => !o)}
                      className="absolute right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer z-10"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-sm font-black rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer mt-2 transition-all hover:scale-[1.02]">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            )}

            {/* OTP LOGIN FORM */}
            {loginMethod === 'otp' && (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-slate-400 mb-2" htmlFor="otp-email">
                    Registered Email Address
                  </label>
                  <input
                    id="otp-email"
                    name="email"
                    type="email"
                    disabled={otpSent}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-60 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={errors.email ? { borderColor: '#ef4444' } : {}}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email}</p>}
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-slate-400 mb-2" htmlFor="otp-code">
                      6-Digit OTP Code
                    </label>
                    <input
                      id="otp-code"
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3.5 text-center font-bold tracking-[6px] text-base bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:tracking-normal shadow-inner"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                  </div>
                )}

                {!otpSent ? (
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-sm font-black rounded-2xl flex justify-center items-center shadow-lg shadow-emerald-500/25 cursor-pointer mt-2 transition-all hover:scale-[1.02]">
                    {loading ? 'Sending OTP...' : 'Send OTP Code'}
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-sm font-black rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer mt-2 transition-all hover:scale-[1.02]">
                    {loading ? 'Verifying...' : 'Verify OTP & Login'} <CheckCircle2 size={16} />
                  </button>
                )}
              </form>
            )}

            {/* DIVIDER & GOOGLE SIGN IN BUTTON */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <span className="relative px-4 text-[10px] font-extrabold uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-400">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.36 7.24 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.09-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.64 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Register Footer Link */}
            <p className="text-center mt-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold hover:underline text-emerald-600 dark:text-emerald-400">
                Register Free
              </Link>
            </p>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">🔒 Secure Login</span>
            <span className="flex items-center gap-1">🛡 HIPAA Compliant</span>
            <span className="flex items-center gap-1">🔐 2FA Ready</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}