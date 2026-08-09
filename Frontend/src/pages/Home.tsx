import { useNavigate } from 'react-router-dom'
import {
  Shield, QrCode, Zap, MapPin, Bot, Bell, Users, FileText,
  ArrowRight, ChevronRight, Star, Phone, Mail, MessageSquare,
  CheckCircle, Heart, Activity, Lock, Globe
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLang } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const features = [
  { icon: Shield, title: 'Digital Health Identity', desc: 'A verified, tamper-proof health identity that proves who you are in any medical setting worldwide.', color: '#10b981', badge: 'Secure' },
  { icon: QrCode, title: 'Medical QR Code', desc: 'Scan your personal QR code to instantly share your complete medical profile with any healthcare provider.', color: '#06b6d4', badge: 'Instant' },
  { icon: Zap, title: 'Emergency Profile', desc: 'In emergencies, first responders get instant access to your critical health info — blood group, allergies, contacts.', color: '#f59e0b', badge: 'SOS Ready' },
  { icon: MapPin, title: 'Nearby Hospitals', desc: 'Find the nearest hospitals, clinics, and pharmacies with real-time availability and directions.', color: '#8b5cf6', badge: 'Live Maps' },
  { icon: Bot, title: 'AI Health Assistant', desc: 'Ask your personal AI health assistant anything — symptoms, medicines, diet advice, or report analysis.', color: '#ec4899', badge: '24/7 AI' },
  { icon: Bell, title: 'Medicine Reminder', desc: "Never miss a dose. Set smart reminders for all your medications with dosage and timing alerts.", color: '#ef4444', badge: 'Smart' },
  { icon: Users, title: 'Emergency Contacts', desc: "Store multiple emergency contacts with priority levels, ensuring the right people are notified first.", color: '#f97316', badge: 'Priority' },
  { icon: FileText, title: 'Medical Reports', desc: 'Upload, organize, and share your medical reports, prescriptions, and insurance documents securely.', color: '#3b82f6', badge: 'Cloud Sync' },
]

const stats = [
  { value: '2.4M+', label: 'Health Profiles Created', color: '#10b981' },
  { value: '99.9%', label: 'Uptime Reliability', color: '#06b6d4' },
  { value: '150+', label: 'Countries Supported', color: '#8b5cf6' },
  { value: '4.9★', label: 'User Rating', color: '#f59e0b' },
]

const steps = [
  { num: '01', title: 'Create Account', desc: "Sign up in 60 seconds with your basic information.", icon: Shield, color: '#3b82f6' },
  { num: '02', title: 'Complete Medical Profile', desc: "Fill out your comprehensive health profile across guided steps.", icon: FileText, color: '#10b981' },
  { num: '03', title: 'Generate Health Pass', desc: "Your unique, encrypted QR code and Pass are instantly generated.", icon: QrCode, color: '#f59e0b' },
  { num: '04', title: 'Access Anywhere', desc: "Share your health identity with any doctor, hospital, or emergency team.", icon: Zap, color: '#ec4899' },
]

const testimonials = [
  { name: 'Dr. Priya Nair', role: 'Cardiologist, Apollo Hospital', text: "HealthID has transformed how I access patient history in emergencies. The QR system is brilliant.", avatar: 'P' },
  { name: 'Rahul Mehta', role: 'Diabetes Patient, Delhi', text: "My blood reports, medicines, and emergency contacts in one scan. It saved my life during an emergency.", avatar: 'R' },
  { name: 'Sofia Martinez', role: 'International Traveler', text: "I travel across 20+ countries. Having my health identity available everywhere gives me incredible peace of mind.", avatar: 'S' },
]

export default function Home() {
  const navigate = useNavigate()
  const { tr, lang } = useLang()
  const { user, isLoggedIn } = useAuth()

  const heroTitleText = tr('heroTitle') || 'Your Digital Health Identity'

  return (
    <div
      className="min-h-screen bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white overflow-x-hidden relative flex flex-col justify-between"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top',
        transition: 'background-color 0.4s cubic-bezier(0.25, 1, 0.5, 1), color 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      <Navbar />

      {/* FLOATING QUERY BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 text-white font-black text-sm shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
        >
          <MessageSquare size={18} />
          <span>{lang === 'hi' ? 'समस्या या Query भेजें' : 'Need Help? / Query'}</span>
        </button>
      </div>

      <div className="flex-1">
        {/* HERO SECTION */}
        <section id="home" className="relative pt-36 pb-24 px-4 lg:px-8 overflow-hidden">
          <div className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none bg-gradient-to-tr from-emerald-500 to-purple-500 blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none bg-gradient-to-br from-purple-500 to-emerald-500 blur-[110px]" />

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-extrabold tracking-wide shadow-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all duration-300 ease-out hover:scale-105">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Global Health ID Network Active
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white font-jakarta transition-all duration-300 ease-out">
                  {heroTitleText.split('\n').map((line: string, i: number) => (
                    <span key={i} className="block">
                      {i === 1 ? <span className="text-emerald-600 dark:text-emerald-400">{line}</span> : line}
                    </span>
                  ))}
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-medium transition-all duration-300 ease-out">
                  {tr('heroSub') || 'Store your medical history securely, generate instant emergency QR passes, find nearby hospitals, and consult your personal AI Health Assistant.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  {!isLoggedIn ? (
                    <>
                      <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base py-4 px-8 rounded-2xl gap-2 flex items-center justify-center shadow-lg shadow-emerald-500/25 cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95">
                        Create HealthID <ArrowRight size={18} />
                      </button>
                      <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 shadow-sm">
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base py-4 px-8 rounded-2xl gap-2 flex items-center justify-center shadow-lg shadow-emerald-500/25 cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95">
                        Go to Dashboard <ArrowRight size={18} />
                      </button>
                      <button onClick={() => navigate('/health-card')} className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-base transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 shadow-sm">
                        My Digital Pass
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {['HIPAA Compliant', 'ISO 27001 Security', 'AES-256 Encrypted'].map(badge => (
                    <div key={badge} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all duration-300 ease-out hover:translate-x-1">
                      <CheckCircle size={16} className="text-emerald-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative flex items-center justify-center py-10">
                <div className="relative w-full max-w-md flex items-center justify-center">

                  {/* HERO ID CARD */}
                  <div
                    className="w-full max-w-[390px] p-8 rounded-[32px] shadow-2xl hover:shadow-2xl transition-all duration-500 ease-out relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-2"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-sm tracking-tighter">
                          HI
                        </div>
                        <span className="text-slate-900 dark:text-white text-base font-black tracking-wide font-jakarta">HealthID</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">● VERIFIED</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl border border-emerald-400/30 overflow-hidden shadow-inner">
                        {user?.profilePhoto ? (
                          <img src={user.profilePhoto} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          user?.fullName?.[0] || 'V'
                        )}
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold text-base truncate">{user?.fullName || 'Vinay Kumar'}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-mono font-bold">{user?.healthId || 'MS1001'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        [user?.bloodGroup || 'AB+', 'Blood', '#ef4444'],
                        [user?.height ? `${user.height}cm` : '175cm', 'Height', '#06b6d4'],
                        [user?.weight ? `${user.weight}kg` : '65kg', 'Weight', '#f59e0b']
                      ].map(([val, label, col]) => (
                        <div key={label} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 text-center border border-slate-200 dark:border-slate-700 shadow-inner transition-all duration-300 ease-out hover:scale-105">
                          <p className="text-sm font-extrabold" style={{ color: col as string }}>{val}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-extrabold tracking-wider mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">● Emergency SOS Ready</span>
                      <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20 font-bold">AES-256</span>
                    </div>
                  </div>

                  {/* FLOATING QR BADGE */}
                  <div
                    onClick={() => navigate('/qr-code')}
                    className="absolute -right-4 -bottom-6 p-4 shadow-xl hover:shadow-2xl cursor-pointer hover:scale-110 transition-all duration-300 ease-out z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"
                  >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-white rounded-2xl p-1 flex items-center justify-center shadow-inner border border-slate-200">
                      <QrCode size={64} className="text-slate-900" />
                    </div>
                    <p className="text-center text-xs font-black mt-1.5 text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-0.5">
                      Scan QR <ChevronRight size={12} />
                    </p>
                  </div>

                  {/* FLOATING VITALS BADGE */}
                  <div className="absolute -left-6 top-8 py-3 px-4 shadow-xl flex items-center gap-3.5 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:scale-105 transition-all duration-300 ease-out">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      <Heart size={20} className="fill-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Vitals Status</p>
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Normal & Synced</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-4 relative overflow-hidden bg-white/60 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-2 transition-all duration-300 ease-out group cursor-pointer"
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 font-jakarta tracking-tight group-hover:scale-105 transition-transform duration-300" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 px-4 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Core Features
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white font-jakarta">
                Everything Your Medical Identity Needs
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                A comprehensive health ecosystem engineered to put your medical records and emergency care securely in your hands.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div
                    key={i}
                    className="group relative p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2.5"
                    onClick={() => {
                      if (f.title.includes('Assistant')) navigate('/ai-chat')
                      else if (f.title.includes('Hospitals')) navigate('/hospitals')
                      else if (f.title.includes('QR')) navigate('/qr-code')
                      else navigate('/dashboard')
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-115 group-hover:rotate-6 shadow-sm"
                          style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}35` }}
                        >
                          <Icon size={26} className="stroke-[2.2]" />
                        </div>
                        <span
                          className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wider shadow-sm"
                          style={{ color: f.color, background: `${f.color}10`, borderColor: `${f.color}30` }}
                        >
                          {f.badge}
                        </span>
                      </div>

                      <h3 className="font-black text-lg mb-3 text-slate-900 dark:text-white tracking-tight font-jakarta group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {f.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                        {f.desc}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-1.5 text-xs font-extrabold mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 group-hover:translate-x-2 transition-transform duration-300 ease-out"
                      style={{ color: f.color }}
                    >
                      <span>Explore feature</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 px-4 lg:px-8 bg-white/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-jakarta">
                Up and Running in 4 Simple Steps
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="relative group">
                    <div className="p-6 h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-2 transition-all duration-300 ease-out rounded-3xl cursor-pointer">
                      <div>
                        <div className="text-3xl font-black mb-4 font-jakarta group-hover:scale-110 transition-transform duration-300 ease-out" style={{ color: step.color }}>{step.num}</div>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-115 transition-transform duration-300 ease-out shadow-sm"
                          style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}
                        >
                          <Icon size={20} />
                        </div>
                        <h3 className="font-black text-sm mb-2 text-slate-900 dark:text-white font-jakarta">{step.title}</h3>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider mb-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  About HealthID
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-6 text-slate-900 dark:text-white tracking-tight font-jakarta">
                  Healthcare Should Have No Borders.
                </h2>
                <p className="text-base leading-relaxed mb-8 text-slate-600 dark:text-slate-300 font-medium">
                  We built HealthID to give everyone instant access to their health history anytime, anywhere. Your critical health identity stays fully encrypted and globally accepted.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Lock, title: 'Bank-Grade Security', desc: 'AES-256 encrypted records', color: '#3b82f6' },
                    { icon: Activity, title: 'Real-Time Sync', desc: 'Instant profile updates', color: '#10b981' },
                    { icon: Heart, title: 'Emergency Ready', desc: 'Scannable trauma pass', color: '#ef4444' },
                    { icon: Globe, title: 'Global Standard', desc: 'Accepted worldwide', color: '#8b5cf6' },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out"
                          style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white font-jakarta">{item.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95">
                  Get Your Health ID <ArrowRight size={16} />
                </button>
              </div>

              <div>
                <div className="p-8 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl hover:shadow-2xl hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer group">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 ease-out">
                      <Shield size={28} />
                    </div>
                    <div>
                      <p className="font-black text-base text-slate-900 dark:text-white font-jakarta group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Our Core Mission</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Democratizing healthcare access worldwide</p>
                    </div>
                  </div>
                  {[
                    'Provide every individual with a verified digital health pass',
                    'Enable instant emergency medical profile access for first responders',
                    'Use AI to simplify medical reports and health inquiries',
                    'Protect sensitive health records with strict HIPAA standards'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5 transition-transform duration-300 ease-out hover:translate-x-1">
                      <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-4 lg:px-8 bg-white/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-jakarta">
                Trusted by Patients & Healthcare Professionals
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:-translate-y-2 transition-all duration-300 ease-out border border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer">
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-500">
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-amber-500" />)}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed mb-6 text-slate-600 dark:text-slate-300 font-medium">"{t.text}"</p>
                  </div>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white font-jakarta">{t.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT & CTA SECTION */}
        <section id="contact" className="py-24 px-4 lg:px-8 bg-white/80 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-slate-900 dark:text-white font-jakarta">
              Get in Touch With Us
            </h2>
            <p className="text-sm sm:text-base mb-14 text-slate-600 dark:text-slate-300 font-medium">Support team is here for you 24/7.</p>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {[
                { 
                  icon: Phone, 
                  title: 'Phone Support', 
                  value: '8601317580', 
                  sub: '24/7 Toll-Free Helpline', 
                  color: '#10b981',
                  action: () => window.location.href = 'tel:8601317580'
                },
                { 
                  icon: Mail, 
                  title: 'Email Assistance', 
                  value: 'vinay55ti@gmail.com', 
                  sub: 'Response within 2 hours', 
                  color: '#3b82f6',
                  action: () => window.location.href = 'mailto:vinay55ti@gmail.com'
                },
                { 
                  icon: MessageSquare, 
                  title: 'AI Assistant', 
                  value: 'Live Chat', 
                  sub: 'Instant medical help', 
                  color: '#8b5cf6',
                  action: () => navigate('/ai-chat')
                },
              ].map((c, i) => {
                const Icon = c.icon
                return (
                  <div 
                    key={i} 
                    onClick={c.action}
                    className="p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-[#070b19] hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer flex flex-col items-center text-center shadow-sm hover:-translate-y-2.5 group"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-115 transition-transform duration-300 ease-out" style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>
                      <Icon size={26} />
                    </div>
                    <p className="font-bold text-base mb-2 text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-sm sm:text-base font-black mb-2" style={{ color: c.color }}>{c.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{c.sub}</p>
                  </div>
                )
              })}
            </div>

            {/* Expansive Gradient CTA Box */}
            <div className="p-10 sm:p-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 border border-emerald-400/30 text-white shadow-2xl rounded-[36px] relative overflow-hidden transition-all duration-300 ease-out hover:shadow-emerald-500/20">
              <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 font-jakarta relative z-10">
                Start Protecting Your Health Today
              </h3>
              <p className="text-white/90 text-sm sm:text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed relative z-10">
                Join thousands relying on HealthID for instant medical emergency identification and secure health tracking.
              </p>
              
              <button 
                type="button"
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/register')} 
                className="bg-white hover:bg-slate-100 text-slate-900 font-black py-4 px-10 rounded-2xl transition-all duration-300 ease-out flex items-center gap-2.5 mx-auto shadow-2xl text-sm sm:text-base cursor-pointer hover:scale-105 active:scale-95 relative z-10"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Create Free Health Pass'}</span> 
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}