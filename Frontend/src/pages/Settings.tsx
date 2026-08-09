import { useState } from 'react'
import {
  Menu, Sun, Moon, Lock, Shield, LogOut, User, ChevronRight,
  CheckCircle, Smartphone, Download, Trash2, AlertTriangle, Globe
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang, type Lang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, tr } = useLang()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const [notifications, setNotifications] = useState({
    medicineReminder: true,
    healthTips: true,
    appointmentAlerts: false,
    emergencyAlerts: true,
    newsletter: false,
  })

  const [privacy, setPrivacy] = useState({
    shareWithDoctors: true,
    emergencyAccess: true,
    analyticsData: false,
    publicProfile: false,
  })

  const langs: { code: Lang; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ]

  const handleExport = async () => {
    setExportLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `healthid_health_data_${user?.healthId || 'HEALTH'}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportLoading(false)
    showToast(lang === 'hi' ? 'स्वास्थ्य डेटा सफलतापूर्वक निर्यात किया गया!' : 'Health data exported successfully!', 'success')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    showToast(lang === 'hi' ? 'सफलतापूर्वक लॉग आउट हो गया' : 'Logged out successfully', 'success')
  }

  const handleDeleteAccount = () => {
    logout()
    navigate('/')
    showToast(lang === 'hi' ? 'खाता हटा दिया गया। हमें खेद है कि आप जा रहे हैं।' : 'Account deleted. We\'re sorry to see you go.', 'info')
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-3xl transition-colors duration-300">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-black text-sm text-amber-600 dark:text-white font-jakarta">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  )

  const Toggle = ({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
      <div className="flex-1 mr-4">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
        {desc && <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400 font-medium">{desc}</p>}
      </div>
      <button 
        type="button" 
        onClick={onChange} 
        className="relative w-11 h-6 rounded-full transition-all shrink-0 cursor-pointer"
        style={{ background: checked ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(100, 116, 139, 0.3)' }}
      >
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: checked ? '22px' : '2px' }} />
      </button>
    </div>
  )

  return (
    <div 
      className="flex min-h-screen bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                {tr('settings') || 'Settings'}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'अपनी खाता प्राथमिकताएं और सुरक्षा प्रबंधित करें' : 'Manage your account preferences and security'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              <Globe size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button type="button" onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <Breadcrumb />
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Profile quick */}
            <div className="p-5 flex items-center justify-between border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-3xl transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 font-jakarta">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName?.[0] ?? 'U'
                  )}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white font-jakarta">{user?.fullName || 'User Profile'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
                  <p className="text-xs font-mono mt-0.5 text-cyan-600 dark:text-cyan-400 font-bold">{user?.healthId ?? 'MSHLD-2026-IN'}</p>
                </div>
              </div>
              <button type="button" onClick={() => navigate('/profile')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
                <User size={14} /> {lang === 'hi' ? 'संपादित करें' : 'Edit'}
              </button>
            </div>

            {/* Appearance */}
            <Section title={lang === 'hi' ? 'रूप रंग (Appearance)' : 'Appearance'}>
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{lang === 'hi' ? 'थीम (Theme)' : 'Theme'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lang === 'hi' ? 'अपनी पसंद की कलर स्कीम चुनें' : 'Choose your preferred color scheme'}</p>
                </div>
                <div className="flex gap-2">
                  {[{ val: 'light', icon: Sun, label: lang === 'hi' ? 'लाइट' : 'Light' }, { val: 'dark', icon: Moon, label: lang === 'hi' ? 'डार्क' : 'Dark' }].map(t => {
                    const Icon = t.icon
                    return (
                      <button 
                        type="button" 
                        key={t.val} 
                        onClick={() => theme !== t.val && toggleTheme()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-sm"
                        style={theme === t.val
                          ? { background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }
                          : { background: 'rgba(100, 116, 139, 0.1)', color: 'var(--muted-foreground)', borderColor: 'rgba(100, 116, 139, 0.2)' }}
                      >
                        <Icon size={14} />{t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Section>

            {/* Language */}
            <Section title={lang === 'hi' ? 'भाषा (Language)' : 'Language'}>
              <div className="px-6 py-4">
                <p className="text-sm font-bold mb-3 text-slate-800 dark:text-slate-100">{lang === 'hi' ? 'भाषा चुनें' : 'Select Language'}</p>
                <div className="grid grid-cols-2 gap-2">
                  {langs.map(l => (
                    <button 
                      type="button" 
                      key={l.code} 
                      onClick={() => { setLang(l.code); showToast(lang === 'hi' ? `भाषा बदलकर ${l.label} हो गई` : `Language changed to ${l.label}`, 'success') }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-sm"
                      style={lang === l.code
                        ? { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: '#10b981' }
                        : { background: 'rgba(100, 116, 139, 0.05)', color: 'var(--muted-foreground)', borderColor: 'rgba(100, 116, 139, 0.2)' }}
                    >
                      <span>{l.flag}</span>{l.label}
                      {lang === l.code && <CheckCircle size={14} className="ml-auto text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* Notifications */}
            <Section title={lang === 'hi' ? 'सूचनाएं (Notifications)' : 'Notifications'}>
              <Toggle label={lang === 'hi' ? 'दवा अनुस्मारक' : 'Medicine Reminders'} desc={lang === 'hi' ? 'आपकी दवाओं के लिए दैनिक अलर्ट' : 'Daily alerts for your medications'} checked={notifications.medicineReminder} onChange={() => { setNotifications(n => ({ ...n, medicineReminder: !n.medicineReminder })); showToast(lang === 'hi' ? 'प्राथमिकता अपडेट की गई' : 'Notification preference updated', 'success') }} />
              <Toggle label={lang === 'hi' ? 'स्वास्थ्य युक्तियाँ' : 'Health Tips'} desc={lang === 'hi' ? 'साप्ताहिक व्यक्तिगत स्वास्थ्य सलाह' : 'Weekly personalized health advice'} checked={notifications.healthTips} onChange={() => setNotifications(n => ({ ...n, healthTips: !n.healthTips }))} />
              <Toggle label={lang === 'hi' ? 'अपॉइंटमेंट अलर्ट' : 'Appointment Alerts'} desc={lang === 'hi' ? 'निर्धारित मुलाकातों के लिए अनुस्मारक' : 'Reminders for scheduled appointments'} checked={notifications.appointmentAlerts} onChange={() => setNotifications(n => ({ ...n, appointmentAlerts: !n.appointmentAlerts }))} />
              <Toggle label={lang === 'hi' ? 'आपातकालीन अलर्ट' : 'Emergency Alerts'} desc={lang === 'hi' ? 'महत्वपूर्ण स्वास्थ्य सूचनाएं' : 'Critical health notifications'} checked={notifications.emergencyAlerts} onChange={() => setNotifications(n => ({ ...n, emergencyAlerts: !n.emergencyAlerts }))} />
              <Toggle label={lang === 'hi' ? 'न्यूज़लेटर' : 'Newsletter'} desc={lang === 'hi' ? 'मासिक स्वास्थ्य अंतर्दृष्टि और अपडेट' : 'Monthly health insights and product updates'} checked={notifications.newsletter} onChange={() => setNotifications(n => ({ ...n, newsletter: !n.newsletter }))} />
            </Section>

            {/* Privacy */}
            <Section title={lang === 'hi' ? 'गोपनीयता और डेटा (Privacy & Data)' : 'Privacy & Data'}>
              <Toggle label={lang === 'hi' ? 'डॉक्टरों के साथ साझा करें' : 'Share with Doctors'} desc={lang === 'hi' ? 'सत्यापित डॉक्टरों को अपनी प्रोफ़ाइल देखने की अनुमति दें' : 'Allow verified doctors to view your full profile'} checked={privacy.shareWithDoctors} onChange={() => setPrivacy(p => ({ ...p, shareWithDoctors: !p.shareWithDoctors }))} />
              <Toggle label={lang === 'hi' ? 'आपातकालीन पहुंच' : 'Emergency Access'} desc={lang === 'hi' ? 'लॉगिन के बिना आपातकालीन क्यूआर स्कैन की अनुमति दें' : 'Allow emergency QR scan without login'} checked={privacy.emergencyAccess} onChange={() => setPrivacy(p => ({ ...p, emergencyAccess: !p.emergencyAccess }))} />
              <Toggle label={lang === 'hi' ? 'सार्वजनिक प्रोफ़ाइल' : 'Public Profile'} desc={lang === 'hi' ? 'हेल्थ आईडी के माध्यम से किसी को भी प्रोफ़ाइल देखने दें' : 'Allow anyone to view basic profile via Health ID'} checked={privacy.publicProfile} onChange={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))} />
              <Toggle label={lang === 'hi' ? 'एनालिटिक्स डेटा' : 'Analytics Data'} desc={lang === 'hi' ? 'गुमनाम डेटा के साथ HealthID को बेहतर बनाने में मदद करें' : 'Help improve HealthID with anonymous usage data'} checked={privacy.analyticsData} onChange={() => setPrivacy(p => ({ ...p, analyticsData: !p.analyticsData }))} />
            </Section>

            {/* Security */}
            <Section title={lang === 'hi' ? 'सुरक्षा (Security)' : 'Security'}>
              {[
                { icon: Lock, label: lang === 'hi' ? 'पासवर्ड बदलें' : 'Change Password', desc: lang === 'hi' ? 'अपना खाता पासवर्ड अपडेट करें' : 'Update your account password' },
                { icon: Smartphone, label: lang === 'hi' ? 'दो-चरण सत्यापन (2FA)' : 'Two-Factor Authentication', desc: lang === 'hi' ? 'अतिरिक्त सुरक्षा के लिए 2FA सक्षम करें' : '2FA is disabled — enable for extra security' },
                { icon: Shield, label: lang === 'hi' ? 'सक्रिय सत्र' : 'Active Sessions', desc: lang === 'hi' ? 'उन उपकरणों को प्रबंधित करें जहाँ आप लॉग इन हैं' : 'Manage devices where you\'re logged in' },
                { icon: Globe, label: lang === 'hi' ? 'लॉगिन इतिहास' : 'Login History', desc: lang === 'hi' ? 'हाल के खाता एक्सेस लॉग देखें' : 'View recent account access logs' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <button 
                    type="button" 
                    key={item.label} 
                    onClick={() => showToast(`${item.label} — ${lang === 'hi' ? 'शीघ्र आ रहा है' : 'coming soon'}`, 'info')}
                    className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </button>
                )
              })}
            </Section>

            {/* Export Health Data */}
            <div className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-colors duration-300">
              <button 
                type="button" 
                onClick={handleExport} 
                disabled={exportLoading}
                className="w-full flex items-center gap-3 px-6 py-5 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40 disabled:opacity-60 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {exportLoading ? (
                    <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {exportLoading ? (lang === 'hi' ? 'निर्यात की तैयारी हो रही है...' : 'Preparing export...') : (lang === 'hi' ? 'स्वास्थ्य डेटा निर्यात करें' : 'Export Health Data')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lang === 'hi' ? 'अपने स्वास्थ्य रिकॉर्ड का पूर्ण JSON बैकअप डाउनलोड करें' : 'Download a complete JSON backup of your health records'}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-slate-400" />
              </button>
            </div>

            {/* Logout */}
            <div className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-colors duration-300">
              <button 
                type="button" 
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-3 px-6 py-5 transition-all hover:bg-rose-500/10 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <LogOut size={16} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-rose-500">{tr('logout') || 'Sign Out'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lang === 'hi' ? 'इस डिवाइस पर अपने खाते से साइन आउट करें' : 'Sign out from your account on this device'}</p>
                </div>
              </button>
            </div>

            {/* Delete Account — danger zone */}
            <div className="rounded-3xl overflow-hidden border border-rose-500/30 shadow-xl bg-white dark:bg-slate-900 transition-colors duration-300">
              <div className="px-6 py-3 bg-rose-500/10 border-b border-rose-500/20">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-500">{lang === 'hi' ? 'खतरा क्षेत्र (Danger Zone)' : 'Danger Zone'}</p>
              </div>
              <div>
                <button 
                  type="button" 
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 px-6 py-5 transition-all hover:bg-rose-500/10 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <Trash2 size={16} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm text-rose-500">{lang === 'hi' ? 'खाता हटाएँ' : 'Delete Account'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lang === 'hi' ? 'स्थाई रूप से अपना खाता और सभी स्वास्थ्य डेटा हटाएं। इसे पूर्ववत नहीं किया जा सकता।' : 'Permanently delete your account and all health data. This cannot be undone.'}</p>
                  </div>
                  <AlertTriangle size={16} className="text-rose-500 opacity-60" />
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              HealthID v2.5.0-PRO · © {new Date().getFullYear()} · <a href="#" className="hover:underline text-indigo-600 dark:text-indigo-400 font-bold">{lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</a> · <a href="#" className="hover:underline text-indigo-600 dark:text-indigo-400 font-bold">{lang === 'hi' ? 'शर्तें' : 'Terms'}</a>
            </p>
          </div>
        </main>

        <Footer />
      </div>

      {confirmLogout && (
        <ConfirmModal
          title={lang === 'hi' ? 'साइन आउट करें?' : 'Sign out?'}
          message={lang === 'hi' ? 'आपको होम पेज पर रीडायरेक्ट कर दिया जाएगा और अपनी स्वास्थ्य प्रोफ़ाइल तक पहुंचने के लिए फिर से साइन इन करना होगा।' : 'You\'ll be redirected to the home page and will need to sign in again to access your health profile.'}
          confirmLabel={lang === 'hi' ? 'साइन आउट' : 'Sign Out'}
          cancelLabel={lang === 'hi' ? 'रुकें' : 'Stay'}
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={lang === 'hi' ? 'खाता हमेशा के लिए हटाएं?' : 'Delete Account Permanently?'}
          message={lang === 'hi' ? 'यह आपकी हेल्थ आईडी, चिकित्सा रिकॉर्ड, दस्तावेज और सभी संबंधित डेटा को स्थायी रूप से हटा देगा। इस कार्रवाई को बदला नहीं जा सकता।' : 'This will permanently delete your Health ID, medical records, documents, and all associated data. This action cannot be reversed.'}
          confirmLabel={lang === 'hi' ? 'हाँ, सब कुछ हटाएं' : 'Yes, Delete Everything'}
          cancelLabel={lang === 'hi' ? 'खाता रखें' : 'Keep Account'}
          danger
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}