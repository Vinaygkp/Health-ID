import { useState, useRef } from 'react'
import { Menu, Download, Shield, Info, Lock, CheckCircle, ExternalLink, QrCode, Sun, Moon, Globe } from 'lucide-react'
import QRCode from 'react-qr-code'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'

export default function QRPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')
  const qrRef = useRef<HTMLDivElement>(null)

  // 🔗 REAL PUBLIC URL FOR SCANNING
  const publicCardUrl = `${window.location.origin}/health/${user?.healthId || 'MSHLD-2026-IN-123456'}`

  const sizes = { small: 150, medium: 210, large: 280 }

  // Functional Image Download Handler
  const handleDownload = () => {
    const svgNode = qrRef.current?.querySelector('svg')
    if (!svgNode) return

    const svgData = new XMLSerializer().serializeToString(svgNode)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const URL = window.URL || window.webkitURL || window
    const blobURL = URL.createObjectURL(svgBlob)

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        const png = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = png
        downloadLink.download = `${user?.fullName || 'Health'}_Medical_QR.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        showToast(lang === 'hi' ? 'आपातकालीन क्यूआर कोड सफलतापूर्वक डाउनलोड हो गया!' : 'Emergency QR Code downloaded successfully!', 'success')
      }
    }
    image.src = blobURL
  }

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
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                {lang === 'hi' ? 'आपातकालीन क्यूआर पास' : 'Emergency QR Pass'}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'तत्काल प्रथम-उत्तरदाता स्कैन करने योग्य चिकित्सा पहचान' : 'Instant first-responder scannable medical identity'}
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

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: QR Display & Controls (7 Cols) */}
              <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-500/20">
                    <QrCode size={24} />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                    {lang === 'hi' ? 'डिजिटल मेडिकल पास' : 'Digital Medical Pass'}
                  </h2>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
                    {lang === 'hi' ? 'लाइव आपातकालीन जीवन-रक्षक विटल्स तक सुरक्षित रूप से पहुंचने के लिए किसी भी मोबाइल डिवाइस कैमरे से स्कैन करें।' : 'Scan with any mobile device camera to securely access live emergency vitals.'}
                  </p>
                </div>

                {/* Size Selector */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {(['small', 'medium', 'large'] as const).map(s => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setSize(s)}
                      className="px-4 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer"
                      style={size === s
                        ? { background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }
                        : { color: 'var(--muted-foreground)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* QR Code Container */}
                <div ref={qrRef} className="p-6 rounded-3xl bg-white shadow-2xl border-4 border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-105">
                  <QRCode
                    value={publicCardUrl}
                    size={sizes[size]}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox="0 0 256 256"
                    level="H"
                  />
                </div>

                <div className="text-center">
                  <p className="font-black text-base tracking-tight text-slate-900 dark:text-white font-jakarta">{user?.fullName || 'User Name'}</p>
                  <p className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider mt-0.5">{user?.healthId ?? 'MSHLD-2026-IN'}</p>
                </div>

                {/* Clean Download Button Only */}
                <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" onClick={handleDownload} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer rounded-2xl transition-all hover:scale-[1.02]">
                    <Download size={16} /> {lang === 'hi' ? 'आपातकालीन क्यूआर कोड डाउनलोड करें (PNG)' : 'Download Emergency QR Code (PNG)'}
                  </button>
                </div>
              </div>

              {/* Right Column: Info & Preview Panel (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Emergency Preview Box */}
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-rose-500/30 shadow-xl rounded-3xl transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold border border-rose-500/20">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight text-amber-600 dark:text-white font-jakarta">
                        {lang === 'hi' ? 'लाइव आपातकालीन पूर्वावलोकन' : 'Live Emergency Preview'}
                      </p>
                      <p className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">
                        {lang === 'hi' ? 'चिकित्सक क्या देखते हैं' : 'What Responders See'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      [lang === 'hi' ? 'पूरा नाम' : 'Full Name', user?.fullName ?? '—'],
                      [lang === 'hi' ? 'रक्त समूह' : 'Blood Group', user?.bloodGroup ?? '—'],
                      [lang === 'hi' ? 'गंभीर एलर्जी' : 'Critical Allergies', [...(user?.foodAllergies ?? []), ...(user?.medicineAllergies ?? [])].slice(0, 2).join(', ') || (lang === 'hi' ? 'कोई रिपोर्ट नहीं' : 'None reported')],
                      [lang === 'hi' ? 'पुरानी बीमारियां' : 'Chronic Conditions', (user?.diseases ?? []).slice(0, 2).join(', ') || (lang === 'hi' ? 'कोई दर्ज नहीं' : 'None recorded')],
                      [lang === 'hi' ? 'प्राथमिक एसओएस संपर्क' : 'Primary SOS Contact', user?.emergencyContacts?.[0]?.name ?? '—'],
                      [lang === 'hi' ? 'एसओएस फोन' : 'SOS Phone', user?.emergencyContacts?.[0]?.phone ?? '—'],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{k}</span>
                        <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About QR info */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Info size={18} />
                    </div>
                    <p className="font-black text-sm tracking-tight text-amber-600 dark:text-white font-jakarta">
                      {lang === 'hi' ? 'सुरक्षा वास्तुकला' : 'Security Architecture'}
                    </p>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      { icon: Lock, text: lang === 'hi' ? 'किसी भी स्मार्टफोन कैमरे से स्कैन करने योग्य वास्तविक समय वेब-सुलभ सुरक्षित एंडपॉइंट' : 'Real-time web-accessible secure endpoint scannable by any smartphone camera' },
                      { icon: CheckCircle, text: lang === 'hi' ? 'जीवन रक्षक विटल्स को उजागर करने वाला अनुकूलित आपातकालीन लैंडिंग पृष्ठ' : 'Optimized emergency landing page highlighting life-saving vitals' },
                      { icon: Shield, text: lang === 'hi' ? 'अधिकृत प्रेषकों के लिए HIPAA और AES-256 प्रेरित सुरक्षा प्रोटोकॉल' : 'HIPAA & AES-256 inspired security protocol for authorized dispatchers' },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={13} />
                          </div>
                          <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}