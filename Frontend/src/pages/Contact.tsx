import { useState } from 'react'
import { Mail, MessageCircle, ArrowLeft, Globe, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'

export default function Contact() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email')

  // Email Form State
  const [emailForm, setEmailForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    subject: '',
    message: ''
  })

  // WhatsApp Form State
  const [whatsappForm, setWhatsappForm] = useState({
    name: user?.fullName || '',
    phone: '',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)

  // 📧 Send via Email to vinay55ti@gmail.com
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailForm.name || !emailForm.email || !emailForm.message) {
      showToast(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill in all required fields', 'error')
      return
    }

    setSubmitting(true)
    const mailtoUrl = `mailto:vinay55ti@gmail.com?subject=${encodeURIComponent(emailForm.subject || 'Support Query from MediShield AI')}&body=${encodeURIComponent(`Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\nMessage:\n${emailForm.message}`)}`
    window.location.href = mailtoUrl
    showToast(lang === 'hi' ? 'ईमेल क्लाइंट खुल गया है!' : 'Email client opened successfully!', 'success')
    setSubmitting(false)
  }

  // 💬 Send via WhatsApp to 8601317580
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatsappForm.name || !whatsappForm.message) {
      showToast(lang === 'hi' ? 'कृपया नाम और संदेश भरें' : 'Please fill in Name and Message', 'error')
      return
    }

    const adminWhatsAppNumber = '918601317580'
    const whatsappText = `*MediShield AI Support Query*\n\n*Name:* ${whatsappForm.name}\n*Phone:* ${whatsappForm.phone || 'Not provided'}\n*Message:* ${whatsappForm.message}`
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`
    
    window.open(whatsappUrl, '_blank')
    showToast(lang === 'hi' ? 'WhatsApp पर रीडायरेक्ट हो रहा है...' : 'Redirecting to WhatsApp...', 'success')
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-12 max-w-4xl mx-auto w-full pt-48 sm:pt-56 space-y-8 mt-4">
        <Breadcrumb />

        {/* Top Header Section */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-card p-6 sm:p-8 rounded-3xl border border-slate-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <button 
              type="button"
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline mb-3 cursor-pointer"
            >
              <ArrowLeft size={14} /> {lang === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </button>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-jakarta">
              {lang === 'hi' ? 'सहायता और Query केंद्र' : 'Help & Query Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              {lang === 'hi' ? 'अपनी समस्या ईमेल या व्हाट्सएप के माध्यम से सीधे भेजें।' : 'Send your query or issue directly via Email or WhatsApp for quick resolution.'}
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button 
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-500/10 text-foreground border border-slate-500/20 hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              <Globe size={15} className="text-indigo-500" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button 
              type="button" 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-foreground border border-slate-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* TAB SWITCHER FOR EMAIL & WHATSAPP */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-card border border-slate-500/20 max-w-md mx-auto shadow-md">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'email' 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <Mail size={16} /> {lang === 'hi' ? 'ईमेल भेजें' : 'Send Email'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <MessageCircle size={16} /> {lang === 'hi' ? 'व्हाट्सएप भेजें' : 'Send WhatsApp'}
          </button>
        </div>

        {/* EMAIL FORM TAB */}
        {activeTab === 'email' && (
          <div className="card p-6 sm:p-10 shadow-2xl border border-slate-500/20 bg-card rounded-3xl animate-fadeIn">
            <div className="mb-6 pb-4 border-b border-slate-500/20">
              <h2 className="text-lg font-black text-foreground font-jakarta">
                {lang === 'hi' ? 'ईमेल के माध्यम से संपर्क करें' : 'Contact via Email'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'hi' ? 'आपका संदेश सीधे हमारे इनबॉक्स में पहुंचेगा।' : 'Your message will be sent directly to our inbox.'}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'hi' ? 'आपका नाम' : 'Your Name'} *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={emailForm.name} 
                    onChange={e => setEmailForm({ ...emailForm, name: e.target.value })}
                    placeholder={lang === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                    className="input-field text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'hi' ? 'ईमेल पता' : 'Email Address'} *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={emailForm.email} 
                    onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="input-field text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'hi' ? 'विषय (Subject)' : 'Subject'}
                </label>
                <input 
                  type="text" 
                  value={emailForm.subject} 
                  onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder={lang === 'hi' ? 'समस्या का विषय...' : 'Subject of your query'}
                  className="input-field text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'hi' ? 'संदेश / समस्या विवरण' : 'Message / Issue Description'} *
                </label>
                <textarea 
                  required
                  rows={5}
                  value={emailForm.message} 
                  onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder={lang === 'hi' ? 'अपनी समस्या विस्तार से बताएं...' : 'Describe your issue in detail...'}
                  className="input-field text-sm resize-none" 
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-4 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Mail size={18} /> {lang === 'hi' ? 'ईमेल भेजें' : 'Send Email'}
              </button>
            </form>
          </div>
        )}

        {/* WHATSAPP FORM TAB */}
        {activeTab === 'whatsapp' && (
          <div className="card p-6 sm:p-10 shadow-2xl border border-slate-500/20 bg-card rounded-3xl animate-fadeIn">
            <div className="mb-6 pb-4 border-b border-slate-500/20">
              <h2 className="text-lg font-black text-foreground font-jakarta">
                {lang === 'hi' ? 'व्हाट्सएप के माध्यम से चैट करें' : 'Chat via WhatsApp'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'hi' ? 'तुरंत सहायता के लिए व्हाट्सएप पर सीधे मैसेज करें।' : 'Message directly on WhatsApp for instant assistance.'}
              </p>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'hi' ? 'आपका नाम' : 'Your Name'} *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={whatsappForm.name} 
                    onChange={e => setWhatsappForm({ ...whatsappForm, name: e.target.value })}
                    placeholder={lang === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                    className="input-field text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'hi' ? 'मोबाइल नंबर (वैकल्पिक)' : 'Phone Number (Optional)'}
                  </label>
                  <input 
                    type="tel" 
                    value={whatsappForm.phone} 
                    onChange={e => setWhatsappForm({ ...whatsappForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="input-field text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  {lang === 'hi' ? 'संदेश / समस्या विवरण' : 'Message / Issue Description'} *
                </label>
                <textarea 
                  required
                  rows={5}
                  value={whatsappForm.message} 
                  onChange={e => setWhatsappForm({ ...whatsappForm, message: e.target.value })}
                  placeholder={lang === 'hi' ? 'अपनी समस्या व्हाट्सएप पर भेजने के लिए लिखें...' : 'Type your problem to send via WhatsApp...'}
                  className="input-field text-sm resize-none" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle size={18} /> {lang === 'hi' ? 'WhatsApp पर मैसेज भेजें' : 'Send Message to WhatsApp'}
              </button>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}