import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Shield, ShieldCheck, Lock } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useAuth } from '../contexts/AuthContext'

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'][i % 6],
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 3,
    size: Math.random() * 8 + 4,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

export default function RegistrationSuccess() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [checked, setChecked] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)

  const qrValue = `${window.location.origin}/health/${user?.healthId ?? 'MSHLD-DEMO'}`

  useEffect(() => {
    const timer1 = setTimeout(() => setChecked(true), 400)
    const timer2 = setTimeout(() => setShowConfetti(false), 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      {showConfetti && <Confetti />}

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 bg-gradient-to-tr from-emerald-500 to-purple-500 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-2xl animate-fadeInUp">
        {/* Checkmark */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 0 60px rgba(16,185,129,0.4)' }}
          >
            <CheckCircle size={44} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-3xl mb-2">🎉</p>
          <h1 className="text-3xl sm:text-4xl font-black mb-3 text-amber-600 dark:text-white font-jakarta tracking-tight">
            HealthID Created Successfully!
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-purple-700 dark:text-slate-400 font-medium">
            Your personal digital health identity has been created successfully. Your medical profile is now securely stored and ready to access anytime.
          </p>
        </div>

        {/* Main card */}
        <div className="p-8 mb-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-colors duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Profile info */}
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden shadow-md bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 font-jakarta"
                >
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName?.[0] ?? 'U'
                  )}
                </div>
                <div>
                  <p className="font-black text-xl text-amber-600 dark:text-white font-jakarta">
                    {user?.fullName ?? 'User'}
                  </p>
                  <p className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {user?.healthId ?? 'MSHLD-2026-IN-987452'}
                  </p>
                </div>
              </div>

              {[
                ['Blood Group', user?.bloodGroup ?? '—'],
                ['Registered', user?.registrationDate ?? new Date().toLocaleDateString()],
                ['Phone', user?.phone ?? '—'],
                ['Email', user?.email ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {k}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {v}
                  </span>
                </div>
              ))}

              {/* Security badges */}
              <div className="space-y-2 pt-2">
                {[
                  { icon: ShieldCheck, label: 'Secure Profile', color: '#10b981' },
                  { icon: Lock, label: 'Encrypted Data', color: '#6366f1' },
                  { icon: CheckCircle, label: 'HealthID Verified', color: '#06b6d4' },
                ].map((b) => {
                  const Icon = b.icon
                  return (
                    <div key={b.label} className="flex items-center gap-2">
                      <Icon size={14} style={{ color: b.color }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {b.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
              <div ref={qrRef} className="p-4 rounded-2xl mb-4 bg-white border-2 border-slate-200 dark:border-slate-700 shadow-md">
                <QRCode value={qrValue} size={150} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} viewBox="0 0 256 256" />
              </div>
              <p className="text-sm font-black mb-1 text-slate-900 dark:text-white font-jakarta">
                Your Medical QR Code
              </p>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
                Scan to access emergency health profile
              </p>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/20 shadow-sm">
          <Shield size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs sm:text-sm text-purple-700 dark:text-slate-300 font-medium leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-bold">Keep your QR Code safe.</strong> In emergencies, authorized healthcare professionals can quickly access your emergency medical information by scanning it.
          </p>
        </div>

        {/* Single Go to Dashboard Button */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
        >
          <CheckCircle size={18} /> Go to Dashboard
        </button>
      </div>
    </div>
  )
}