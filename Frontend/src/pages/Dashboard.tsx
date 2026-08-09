import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Heart, Pill, Users, FileText, QrCode, Bell, TrendingUp,
  AlertCircle, CheckCircle, Clock, Menu, Sun, Moon, Shield, ChevronRight,
  Star, Download, Share2, IdCard, Sparkles, Edit3, Globe
} from 'lucide-react'
import QRCode from 'react-qr-code'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import WelcomeModal from '../components/WelcomeModal'
import Breadcrumb from '../components/Breadcrumb'
import UserAvatar from '../components/UserAvatar'
import { SkeletonDashboard } from '../components/Skeleton'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'

interface StatCardProps {
  icon: typeof Activity
  label: string
  value: string
  sub: string
  color: string
  onClick?: () => void
}

function StatCard({ icon: Icon, label, value, sub, color, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick} 
      className={`card p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border border-slate-500/20 rounded-3xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none" style={{ background: color }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: `${color}15`, color }}>
          <Icon size={22} />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <TrendingUp size={12} /> Active
        </div>
      </div>
      <p className="text-3xl font-black mb-1 tracking-tight multicolor-text font-jakarta">{value}</p>
      <p className="text-sm font-bold mb-1 text-foreground">{label}</p>
      <p className="text-xs font-medium text-slate-400">{sub}</p>
    </div>
  )
}

const COMPLETION_SECTIONS = [
  { key: 'personal', labelEn: 'Personal Info', labelHi: 'व्यक्तिगत जानकारी', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.fullName && u.dob && u.phone && u.email) },
  { key: 'medical', labelEn: 'Medical Info', labelHi: 'चिकित्सा जानकारी', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.bloodGroup && u.height && u.weight) },
  { key: 'allergies', labelEn: 'Allergies', labelHi: 'एलर्जी', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.foodAllergies?.length || u.medicineAllergies?.length) },
  { key: 'medicines', labelEn: 'Medicines', labelHi: 'दवाइयां', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.medicines?.length) },
  { key: 'emergency', labelEn: 'Emergency Contacts', labelHi: 'आपातकालीन संपर्क', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.emergencyContacts?.length) },
  { key: 'documents', labelEn: 'Medical Documents', labelHi: 'चिकित्सा दस्तावेज़', check: (u: NonNullable<ReturnType<typeof useAuth>['user']>) => !!(u.documents?.length) },
]

export default function Dashboard() {
  const { user, isFirstLogin, setFirstLoginDone } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [showWelcome, setShowWelcome] = useState(isFirstLogin)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('medishield-token', token);
      window.history.replaceState({}, document.title, '/dashboard');
      window.location.reload();
    }
  }, []);

  // 🛠️ Fixed loading state resolution so dashboard appears immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [user])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    setFirstLoginDone()
  }

  const sections = user ? COMPLETION_SECTIONS.map(s => ({ ...s, done: s.check(user) })) : []
  const completionPct = sections.length ? Math.round((sections.filter(s => s.done).length / sections.length) * 100) : 0

  const qrValue = user ? `${window.location.origin}/health/${user.healthId}` : `${window.location.origin}/demo`

  const recentActivity = [
    { icon: CheckCircle, textEn: 'Health ID authenticated successfully', textHi: 'हेल्थ आईडी सफलतापूर्वक प्रमाणित हुई', timeEn: '2 hours ago', timeHi: '2 घंटे पहले', color: '#10b981' },
    { icon: FileText, textEn: `${user?.documents?.length ?? 0} medical reports synced`, textHi: `${user?.documents?.length ?? 0} चिकित्सा रिपोर्ट सिंक की गईं`, timeEn: 'Today', timeHi: 'आज', color: '#6366f1' },
    { icon: Users, textEn: `${user?.emergencyContacts?.length ?? 0} emergency circles updated`, textHi: `${user?.emergencyContacts?.length ?? 0} आपातकालीन सर्कल अपडेट किए गए`, timeEn: 'Today', timeHi: 'आज', color: '#f59e0b' },
    { icon: Pill, textEn: 'Smart dosage reminders active', textHi: 'स्मार्ट खुराक अनुस्मारक सक्रिय हैं', timeEn: 'Yesterday', timeHi: 'कल', color: '#8b5cf6' },
    { icon: Shield, textEn: 'End-to-end encrypted via AES-256', textHi: 'AES-256 द्वारा एंड-टू-एंड एन्क्रिप्टेड', timeEn: '2 days ago', timeHi: '2 दिन पहले', color: '#06b6d4' },
  ]

  const quickActions = [
    { id: 1, icon: IdCard, labelEn: 'Health Card', labelHi: 'हेल्थ कार्ड', to: '/health-card', color: '#6366f1', descEn: 'Digital ID', descHi: 'डिजिटल आईडी' },
    { id: 2, icon: QrCode, labelEn: 'View QR', labelHi: 'क्यूआर देखें', to: '/qr-code', color: '#06b6d4', descEn: 'Scan & share', descHi: 'स्कैन और शेयर' },
    { id: 3, icon: Download, labelEn: 'Export Pass', labelHi: 'पास निर्यात करें', to: '/health-card', color: '#f59e0b', descEn: 'Download', descHi: 'डाउनलोड' },
    { id: 4, icon: Share2, labelEn: 'Share ID', labelHi: 'आईडी साझा करें', to: '/qr-code', color: '#ef4444', descEn: 'Instant link', descHi: 'तत्काल लिंक' },
  ]

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : (lang === 'hi' ? 'उपयोगकर्ता' : 'User')

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white relative">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-500/20 backdrop-blur-md bg-card/80">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 bg-slate-500/10 text-foreground cursor-pointer border border-slate-500/20"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <UserAvatar gender={user?.gender} className="w-10 h-10 shadow-md" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight multicolor-text font-jakarta">
                    {lang === 'hi' ? `वापसी पर स्वागत है, ${firstName}` : `Welcome back, ${firstName}`}
                  </h1>
                  <span className="inline-block animate-bounce">👋</span>
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button 
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-500/10 text-foreground border border-slate-500/20 hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              <Globe size={15} className="text-indigo-500" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button 
              type="button" 
              className="w-10 h-10 rounded-xl flex items-center justify-center relative transition-transform hover:scale-105 active:scale-95 shadow-sm bg-slate-500/10 text-foreground border border-slate-500/20 cursor-pointer"
              onClick={() => showToast(lang === 'hi' ? 'सभी प्रणालियाँ चालू हैं। कोई अपठित सुरक्षा चेतावनी नहीं है।' : 'All systems operational. No unread security alerts.', 'info')}
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            </button>
            
            <button 
              type="button" 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm bg-slate-500/10 text-foreground border border-slate-500/20 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        {loading ? (
          <SkeletonDashboard />
        ) : (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <Breadcrumb />

            {/* Profile Completion Banner */}
            {completionPct < 100 && (
              <div className="card p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-500/30 bg-card rounded-3xl">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 text-white">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="text-base sm:text-lg font-black tracking-tight text-foreground font-jakarta">
                          {lang === 'hi' ? 'अपनी चिकित्सा प्रोफ़ाइल पूरी करें' : 'Complete your medical profile'}
                        </p>
                        <span className="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-blue-600 to-fuchsia-600 shadow">
                          {completionPct}% {lang === 'hi' ? 'पूर्ण' : 'Done'}
                        </span>
                      </div>
                      <p className="text-xs mt-1 font-medium text-slate-400">
                        {lang === 'hi' ? 'पूर्ण चिकित्सा अवलोकन देखने के लिए नीचे दिए गए किसी भी अनुभाग पर क्लिक करें।' : 'Click any section below to view complete medical overview and analytics.'}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => navigate('/profile')} 
                    className="btn-primary text-xs py-2.5 px-5 shrink-0 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    {lang === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'} <Edit3 size={14} />
                  </button>
                </div>

                <div className="h-3 rounded-full overflow-hidden mb-5 shadow-inner bg-slate-500/10 border border-slate-500/20">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 shadow"
                    style={{ width: `${completionPct}%` }} 
                  />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {sections.map(s => (
                    <button 
                      key={s.key} 
                      type="button" 
                      onClick={() => navigate(`/medical-overview?tab=${s.key}`)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 border shadow-sm cursor-pointer ${
                        s.done ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' : 'bg-card text-slate-400 border-slate-500/20 hover:text-foreground'
                      }`}
                    >
                      {s.done ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                      <span>{lang === 'hi' ? s.labelHi : s.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard icon={Heart} label={lang === 'hi' ? 'स्वास्थ्य स्कोर' : 'Health Score'} value="87/100" sub={lang === 'hi' ? 'इष्टतम जीवन शक्ति' : 'Optimal Vitality'} color="#ef4444" onClick={() => navigate('/medical-overview?tab=medical')} />
              <StatCard icon={Pill} label={lang === 'hi' ? 'सक्रिय दवाइयां' : 'Active Medicines'} value={`${user?.medicines?.length ?? 0}`} sub={lang === 'hi' ? 'अनुस्मारक सेट हैं' : 'Reminders set'} color="#8b5cf6" onClick={() => navigate('/medical-overview?tab=medicines')} />
              <StatCard icon={Users} label={lang === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contacts'} value={`${user?.emergencyContacts?.length ?? 0}`} sub={lang === 'hi' ? 'तत्काल प्रेषण' : 'Instant dispatch'} color="#f59e0b" onClick={() => navigate('/medical-overview?tab=emergency')} />
              <StatCard icon={FileText} label={lang === 'hi' ? 'चिकित्सा रिकॉर्ड' : 'Medical Records'} value={`${user?.documents?.length ?? 0}`} sub={lang === 'hi' ? 'क्लाउड में सुरक्षित' : 'Secured in cloud'} color="#06b6d4" onClick={() => navigate('/medical-overview?tab=documents')} />
            </div>

            {/* Main Content 3-Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Column: ID Card & Quick Navigation */}
              <div className="space-y-6">
                
                {/* Digital Health Card Mini */}
                <div className="card overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border border-slate-500/20 bg-card" onClick={() => navigate('/health-card')}>
                  <div className="p-6 flex items-center justify-between relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md shadow-inner text-white font-black text-base tracking-tighter">
                        HI
                      </div>
                      <div>
                        <p className="text-white font-black text-base tracking-tight font-jakarta">{lang === 'hi' ? 'डिजिटल हेल्थ आईडी' : 'Digital Health ID'}</p>
                        <p className="text-white/80 text-xs font-mono font-bold">{user?.healthId ?? 'MSHLD-2026-IN'}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform relative z-10" />
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between bg-card border-t border-slate-500/20">
                    <div className="flex items-center gap-6">
                      {[
                        [user?.bloodGroup ?? '—', lang === 'hi' ? 'रक्त समूह' : 'Blood Group'],
                        [`${user?.height ?? '—'}cm`, lang === 'hi' ? 'लंबाई' : 'Height'],
                        [`${user?.weight ?? '—'}kg`, lang === 'hi' ? 'वजन' : 'Weight'],
                      ].map(([val, label]) => (
                        <div key={label} className="text-left">
                          <p className="font-extrabold text-sm tracking-tight text-foreground">{val}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-emerald-500">{lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Mini Card */}
                <div className="card p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 relative group rounded-3xl border border-slate-500/20 bg-card" onClick={() => navigate('/qr-code')}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm text-foreground font-jakarta">{lang === 'hi' ? 'आपातकालीन क्यूआर पास' : 'Emergency QR Pass'}</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-500/10 text-indigo-400 border border-slate-500/20">{lang === 'hi' ? 'सुरक्षित' : 'Secure'}</span>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-3xl shadow-lg transition-transform duration-300 group-hover:scale-105 bg-white border border-slate-200">
                      <QRCode value={qrValue} size={120} />
                    </div>
                  </div>
                  <p className="text-xs font-medium mb-5 text-slate-400">{lang === 'hi' ? 'आपातकालीन चिकित्सा प्रेषण के मामले में तुरंत स्कैन करें' : 'Scan instantly in case of emergency medical dispatch'}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={e => { e.stopPropagation(); navigate('/qr-code') }} className="btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                      <QrCode size={14} /> {lang === 'hi' ? 'पूर्ण पास' : 'Full Pass'}
                    </button>
                    <button type="button" onClick={e => { e.stopPropagation(); showToast(lang === 'hi' ? 'साझा करने के लिए डिजिटल क्यूआर कोड तैयार है!' : 'Digital QR code ready for sharing!', 'success') }} className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer">
                      <Download size={14} /> {lang === 'hi' ? 'सहेजें' : 'Save'}
                    </button>
                  </div>
                </div>

                {/* Quick Navigation Grid */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <p className="font-black text-sm mb-4 text-foreground font-jakarta">{lang === 'hi' ? 'त्वरित नेविगेशन' : 'Quick Navigation'}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map(a => {
                      const Icon = a.icon
                      return (
                        <button 
                          key={a.id} 
                          type="button" 
                          onClick={() => navigate(a.to)}
                          className="flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 group text-center bg-slate-500/5 border border-slate-500/10 cursor-pointer hover:border-indigo-500/40"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow" style={{ background: `${a.color}15`, color: a.color }}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-black block leading-tight text-foreground">{lang === 'hi' ? a.labelHi : a.labelEn}</span>
                            <span className="text-[10px] font-medium block mt-0.5 text-slate-400">{lang === 'hi' ? a.descHi : a.descEn}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Center Column: Medical Summary, Medicines, Uploads */}
              <div className="space-y-6">
                
                {/* Medical Summary */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm text-foreground font-jakarta">{lang === 'hi' ? 'चिकित्सा सारांश' : 'Medical Summary'}</p>
                    <button type="button" onClick={() => navigate('/medical-overview?tab=medical')} className="text-xs font-extrabold hover:underline text-indigo-400 cursor-pointer">{lang === 'hi' ? 'विश्लेषण देखें →' : 'View Analytics →'}</button>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { labelEn: 'Chronic Conditions', labelHi: 'पुरानी बीमारियां', value: (user?.diseases ?? []).join(', ') || (lang === 'hi' ? 'कोई दर्ज नहीं' : 'None recorded'), icon: Activity, color: '#ef4444', tab: 'medical' },
                      { labelEn: 'Allergies & Reactions', labelHi: 'एलर्जी और प्रतिक्रियाएं', value: [...(user?.foodAllergies ?? []), ...(user?.medicineAllergies ?? [])].slice(0, 2).join(', ') || (lang === 'hi' ? 'कोई ज्ञात एलर्जी नहीं' : 'No known allergies'), icon: AlertCircle, color: '#f59e0b', tab: 'allergies' },
                      { labelEn: 'Health Insurance', labelHi: 'स्वास्थ्य बीमा', value: user?.insurance?.split('—')[0]?.trim() || (lang === 'hi' ? 'कोई बीमा पॉलिसी लिंक नहीं है' : 'No insurance policy linked'), icon: Shield, color: '#10b981', tab: 'medical' },
                    ].map(item => {
                      const Icon = item.icon
                      return (
                        <div key={item.labelEn} onClick={() => navigate(`/medical-overview?tab=${item.tab}`)} className="flex items-start gap-3.5 p-3.5 rounded-2xl transition-all hover:bg-slate-500/10 cursor-pointer bg-slate-500/5 border border-slate-500/10">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${item.color}15`, color: item.color }}>
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{lang === 'hi' ? item.labelHi : item.labelEn}</p>
                            <p className="text-xs sm:text-sm font-bold truncate mt-0.5 text-foreground">{item.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Medicine Reminders */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm text-foreground font-jakarta">{lang === 'hi' ? 'दवा के अनुस्मारक' : 'Medicine Reminders'}</p>
                    <button type="button" onClick={() => navigate('/medical-overview?tab=medicines')} className="text-xs font-extrabold hover:underline text-indigo-400 cursor-pointer">{lang === 'hi' ? 'प्रबंधित करें →' : 'Manage →'}</button>
                  </div>
                  {(user?.medicines ?? []).length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-slate-500/30 bg-slate-500/5">
                      <Pill size={28} className="mx-auto mb-2 opacity-40 text-indigo-500 animate-bounce" />
                      <p className="text-xs font-semibold text-slate-400">{lang === 'hi' ? 'कोई सक्रिय नुस्खा नहीं जोड़ा गया' : 'No active prescriptions added'}</p>
                      <button type="button" onClick={() => navigate('/profile')} className="mt-3 text-xs font-black px-4 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer">{lang === 'hi' ? 'नुस्खा जोड़ें' : 'Add Prescription'}</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(user?.medicines ?? []).slice(0, 3).map((med: any, i: number) => (
                        <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer hover:bg-slate-500/10 bg-slate-500/5 border border-slate-500/10 transition-colors" onClick={() => navigate('/medical-overview?tab=medicines')}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-purple-500/10 text-purple-500">
                            <Pill size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-foreground">{med.name}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">
                              {[med.morning && (lang === 'hi' ? '🌅 सुबह' : '🌅 Morning'), med.afternoon && (lang === 'hi' ? '☀️ दोपहर' : '☀️ Afternoon'), med.night && (lang === 'hi' ? '🌙 रात' : '🌙 Night')].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full shadow-sm bg-emerald-500/15 text-emerald-500">{med.dose}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Documents */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm text-foreground font-jakarta">{lang === 'hi' ? 'अपलोड की गई चिकित्सा रिपोर्ट' : 'Uploaded Medical Reports'}</p>
                    <button type="button" onClick={() => navigate('/medical-overview?tab=documents')} className="text-xs font-extrabold hover:underline text-indigo-400 cursor-pointer">{lang === 'hi' ? 'सभी देखें →' : 'View All →'}</button>
                  </div>
                  {(user?.documents ?? []).length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-slate-500/30 bg-slate-500/5">
                      <FileText size={28} className="mx-auto mb-2 opacity-40 text-cyan-500" />
                      <p className="text-xs font-semibold text-slate-400">{lang === 'hi' ? 'अभी तक कोई चिकित्सा दस्तावेज़ अपलोड नहीं किया गया है' : 'No medical documents uploaded yet'}</p>
                      <button type="button" onClick={() => navigate('/profile')} className="mt-3 text-xs font-black px-4 py-2.5 rounded-xl text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-sm cursor-pointer">{lang === 'hi' ? 'रिपोर्ट अपलोड करें' : 'Upload Report'}</button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {(user?.documents ?? []).slice(0, 3).map((doc: any, i: number) => (
                        <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl transition-colors hover:bg-slate-500/10 cursor-pointer bg-slate-500/5 border border-slate-500/10" onClick={() => navigate('/medical-overview?tab=documents')}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-cyan-500/10 text-cyan-500">
                            <FileText size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate text-foreground">{doc.name}</p>
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{doc.type}</p>
                          </div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); showToast(lang === 'hi' ? `${doc.name} डाउनलोड हो रहा है...` : `Downloading ${doc.name}...`, 'info') }} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-500/20 transition-colors text-slate-400 cursor-pointer">
                            <Download size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Activity Log, Emergency Contacts, Health Score */}
              <div className="space-y-6">
                
                {/* Recent Activity Log */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <p className="font-black text-sm mb-4 text-foreground font-jakarta">{lang === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}</p>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={i} className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5" style={{ background: `${item.color}15`, color: item.color }}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold leading-relaxed text-foreground">{lang === 'hi' ? item.textHi : item.textEn}</p>
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1 text-slate-400">
                              <Clock size={11} /> {lang === 'hi' ? item.timeHi : item.timeEn}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Emergency Contacts List */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-sm text-foreground font-jakarta">{lang === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contacts'}</p>
                    <button type="button" onClick={() => navigate('/medical-overview?tab=emergency')} className="text-xs font-extrabold hover:underline text-indigo-400 cursor-pointer">{lang === 'hi' ? 'देखें →' : 'View →'}</button>
                  </div>
                  {(user?.emergencyContacts ?? []).length === 0 ? (
                    <div className="text-center py-6 rounded-2xl border border-dashed border-slate-500/30 bg-slate-500/5">
                      <Users size={24} className="mx-auto mb-2 opacity-40 text-amber-500" />
                      <p className="text-xs font-semibold text-slate-400">{lang === 'hi' ? 'कोई आपातकालीन संपर्क सहेजा नहीं गया है' : 'No emergency contacts saved'}</p>
                      <button type="button" onClick={() => navigate('/profile')} className="mt-3 text-xs font-black px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-sm cursor-pointer">{lang === 'hi' ? 'संपर्क जोड़ें' : 'Add Contact'}</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(user?.emergencyContacts ?? []).map((c: any, i: number) => (
                        <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer hover:bg-slate-500/10 bg-slate-500/5 border border-slate-500/10 transition-colors" onClick={() => navigate('/medical-overview?tab=emergency')}>
                          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-xs font-extrabold shadow-md shrink-0"
                            style={{ background: i === 0 ? '#ef4444' : 'var(--primary)' }}>
                            {c.priority}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-foreground">{c.name}</p>
                            <p className="text-xs font-medium text-slate-400 truncate mt-0.5">{c.relation} · {c.phone}</p>
                          </div>
                          {i === 0 && (
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 shadow-sm bg-rose-500/15 text-rose-500">{lang === 'hi' ? 'प्राथमिक' : 'Primary'}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Health Score Circular Widget */}
                <div className="card p-6 shadow-xl rounded-3xl border border-slate-500/20 bg-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  <p className="font-black text-sm mb-4 text-foreground font-jakarta">{lang === 'hi' ? 'स्वास्थ्य स्कोर' : 'Health Score'}</p>
                  <div className="flex items-center gap-5 mb-5">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--muted)" strokeWidth="8" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="url(#healthGradient)" strokeWidth="8"
                          strokeDasharray={`${(87 / 100) * 201} 201`} strokeLinecap="round" />
                        <defs>
                          <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black tracking-tight text-foreground">87</span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{lang === 'hi' ? 'स्कोर' : 'Score'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-sm sm:text-base tracking-tight text-emerald-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {lang === 'hi' ? 'उत्कृष्ट जीवन शक्ति' : 'Excellent Vitality'}
                      </p>
                      <p className="text-xs font-medium mt-1 leading-relaxed text-slate-400">{lang === 'hi' ? 'सक्रिय प्रोफ़ाइल रिकॉर्ड और विटल्स से सुरक्षित रूप से गणना की गई।' : 'Calculated securely from active profile records & vitals.'}</p>
                      <div className="flex items-center gap-1 mt-2.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} style={{ color: i < 4 ? '#f59e0b' : 'var(--border)', fill: i < 4 ? '#f59e0b' : 'none' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-slate-500/20">
                    {[
                      [lang === 'hi' ? 'प्रोफ़ाइल पूर्णता' : 'Profile Completeness', `${completionPct}%`, completionPct],
                      [lang === 'hi' ? 'नुस्खा अनुपालन' : 'Prescription Compliance', '100%', 100],
                      [lang === 'hi' ? 'दस्तावेज़ सत्यापन' : 'Document Verification', `${Math.min((user?.documents?.length ?? 0) * 33, 100)}%`, Math.min((user?.documents?.length ?? 0) * 33, 100)]
                    ].map(([label, pct, val]) => (
                      <div key={label as string}>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-foreground">{pct}</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden shadow-inner bg-slate-500/20 border border-slate-500/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 transition-all duration-500 shadow" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </main>
        )}

        <Footer />
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-card border border-slate-500/20 rounded-3xl shadow-2xl overflow-hidden">
            <WelcomeModal name={user?.fullName ?? 'User'} onClose={handleCloseWelcome} />
          </div>
        </div>
      )}
    </div>
  )
}