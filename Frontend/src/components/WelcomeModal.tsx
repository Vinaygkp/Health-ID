import { useState, useEffect } from 'react'
import { Shield, QrCode, Bot, X, ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  name: string
  onClose: () => void
}

const TOUR_STEPS = [
  {
    icon: Shield,
    title: 'Your Health Profile',
    desc: 'Your complete medical information is stored securely. Update it anytime from the Profile page.',
    color: 'text-blue-500 bg-blue-500/15',
    action: '/profile',
    actionLabel: 'View Profile',
  },
  {
    icon: QrCode,
    title: 'Your Medical QR Code',
    desc: 'Your unique QR code gives emergency personnel instant access to your critical health data.',
    color: 'text-cyan-500 bg-cyan-500/15',
    action: '/qr-code',
    actionLabel: 'View QR Code',
  },
  {
    icon: Bot,
    title: 'AI Health Assistant',
    desc: 'Ask your AI assistant anything about your health — medicines, symptoms, reports, and more.',
    color: 'text-purple-500 bg-purple-500/15',
    action: '/ai-chat',
    actionLabel: 'Open Assistant',
  },
]

export default function WelcomeModal({ name, onClose }: Props) {
  const navigate = useNavigate()
  const [tourStep, setTourStep] = useState<number | null>(null)

  // Listen to Escape key press to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (tourStep !== null) {
    const step = TOUR_STEPS[tourStep]
    const Icon = step.icon
    return (
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 select-none bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <div
          className="card p-6 sm:p-7 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeInUp bg-card border border-slate-500/20 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === tourStep ? 'bg-indigo-600 w-5' : 'bg-slate-500/30'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-foreground transition-colors p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner ${step.color}`}>
              <Icon size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold mb-2 text-foreground tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {step.desc}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                navigate(step.action)
                onClose()
              }}
              className="btn-secondary flex-1 text-xs sm:text-sm py-2.5 sm:py-3 cursor-pointer"
            >
              {step.actionLabel}
            </button>
            {tourStep < TOUR_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setTourStep((s) => (s ?? 0) + 1)}
                className="btn-primary flex-1 text-xs sm:text-sm py-2.5 sm:py-3 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="btn-primary flex-1 text-xs sm:text-sm py-2.5 sm:py-3 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <CheckCircle size={14} /> Done!
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 select-none bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="card p-6 sm:p-7 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeInUp bg-card border border-slate-500/20 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30 bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600">
            <Shield size={32} className="text-white" />
          </div>
          <p className="text-2xl mb-1">👋</p>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-foreground tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome to MediShield AI
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Hello <strong className="text-foreground">{name ? name.split(' ')[0] : 'there'}</strong>! Your Digital Health Identity is now active. Would you like a quick tour?
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setTourStep(0)}
            className="btn-primary w-full py-3 sm:py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer text-xs sm:text-sm"
          >
            Start Product Tour <ArrowRight size={16} />
          </button>
          <button type="button" onClick={onClose} className="btn-secondary w-full py-3 sm:py-3.5 cursor-pointer text-xs sm:text-sm">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}