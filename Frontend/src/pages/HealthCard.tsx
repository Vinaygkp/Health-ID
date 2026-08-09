import { useState, useRef } from 'react'
import {
  Menu, Download, Shield, Activity, RotateCw, Lock, Copy, Sun, Moon, Globe,
  CheckCircle, Calendar, User, Heart, Ruler, Weight, AlertCircle, Share2, Phone,
} from 'lucide-react'
import QRCode from 'react-qr-code'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'

export default function HealthCard() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front')
  const [, setCopied] = useState(false)

  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  const publicCardUrl = `${window.location.origin}/health/${user.healthId || 'MSHLD-2026-IN-801893'}`

  // 📋 Copy Health ID
  const handleCopyId = () => {
    if (user?.healthId) {
      navigator.clipboard.writeText(user.healthId)
      setCopied(true)
      showToast(lang === 'hi' ? 'हेल्थ आईडी क्लिपबोर्ड पर कॉपी हो गई!' : 'Health ID copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 📥 100% Professional Both Sides Print/Save Handler (Equal Margins & Balanced Card Heights)
  const handleDownloadCard = () => {
    const frontEl = frontCardRef.current
    const backEl = backCardRef.current

    if (!frontEl || !backEl) {
      showToast('Cards are still loading. Please try again.', 'error')
      return
    }

    try {
      showToast(lang === 'hi' ? 'दोनों साइड तैयार की जा रही हैं...' : 'Preparing both sides...', 'info')
      
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        showToast('Popup blocked! Please allow popups for this site.', 'error')
        return
      }

      const frontHtml = frontEl.outerHTML.replace(/\bhidden\b/g, 'block')
      const backHtml = backEl.outerHTML.replace(/\bhidden\b/g, 'block')

      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(style => style.outerHTML)
        .join('')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>HealthID Card</title>
            <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'/%3E%3C/svg%3E" />
            ${styles}
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            <style>
              @page {
                size: A4 portrait;
                margin: 5mm;
              }
              * { box-sizing: border-box; }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: #f8fafc !important;
                background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px) !important;
                background-size: 40px 40px !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 5px;
              }
              .cards-wrapper {
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
                justify-content: center;
                width: 100%;
                transform: scale(0.80);
                transform-origin: center center;
              }
              .print-card {
                width: 520px !important;
                max-width: 520px !important;
                height: 335px !important;
                max-height: 335px !important;
                border-radius: 24px;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column;
                justify-content: space-between;
                padding: 14px 20px !important;
                background: linear-gradient(135deg, #f0f7ff 0%, #e1effe 50%, #e0e7ff 100%) !important;
                box-shadow: none !important;
                border: none !important;
                outline: none !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }

              /* Enforce QR code strictly next to Name & prevent inner stretch */
              .print-front-main {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 12px !important;
                margin-bottom: 2px !important;
              }
              .print-front-profile {
                flex: 1 !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                min-width: 0 !important;
              }
              .print-front-qr {
                flex-shrink: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
              }

              .print-card .grid-cols-5 {
                display: grid !important;
                grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
                gap: 6px !important;
                align-items: center !important;
                margin-bottom: 2px !important;
              }

              .print-emergency {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 8px !important;
                margin-bottom: 2px !important;
              }
              .print-back-grid {
                display: grid !important;
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 10px !important;
              }

              /* Clean up inner borders for back card sections */
              .print-card .bg-white {
                background-color: rgba(255, 255, 255, 0.9) !important;
                border: 1px solid rgba(203, 213, 225, 0.8) !important;
              }

              .action-panel {
                text-align: center;
                margin-top: -25px;
                font-family: sans-serif;
                z-index: 10;
              }
              .action-panel p {
                color: #2563eb;
                font-size: 12px;
                margin-bottom: 4px;
                font-weight: 700;
              }
              .action-panel button {
                padding: 10px 24px;
                background: linear-gradient(135deg, #2563eb, #4f46e5);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                box-shadow: 0 4px 15px rgba(37,99,235,0.4);
                transition: all 0.2s ease;
              }
              .action-panel button:hover {
                opacity: 0.95;
                transform: scale(1.02);
              }
              @media print {
                html, body { background: #f8fafc !important; padding: 0 !important; justify-content: flex-start !important; }
                .print-card { box-shadow: none !important; border: none !important; outline: none !important; page-break-inside: avoid !important; break-inside: avoid !important; }
                .action-panel { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="cards-wrapper">
              <div class="print-card">${frontHtml}</div>
              <div class="print-card">${backHtml}</div>
            </div>
            <div class="action-panel">
              <p>Press <b>Ctrl + S</b> or click below to save both sides as PDF.</p>
              <button onclick="window.print()">Save / Print Both Sides</button>
            </div>
            <script>
              window.onload = function() {
                setTimeout(() => { window.print(); }, 500);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      showToast(lang === 'hi' ? 'दोनों साइड सफलतापूर्वक लोड हो गई हैं!' : 'Both sides loaded successfully!', 'success')
    } catch (err) {
      console.error('Download error:', err)
      showToast('Download failed. Please try again.', 'error')
    }
  }

  // 🔗 Share Pass Link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.fullName} — HealthID Card`,
          text: `Digital Health Card ID: ${user.healthId}`,
          url: publicCardUrl
        })
      } catch {
        // Cancelled
      }
    } else {
      navigator.clipboard.writeText(publicCardUrl)
      showToast(lang === 'hi' ? 'पब्लिक लिंक कॉपी हो गया!' : 'Public link copied to clipboard!', 'success')
    }
  }

  const primaryContact = user.emergencyContacts?.[0] || { name: '—', phone: '—' }
  const allergiesList = [...(user.foodAllergies ?? []), ...(user.medicineAllergies ?? [])].join(', ') || '—'
  const maskedAadhaar = (user as any).aadhaarNumber ? `XXXX-XXXX-${(user as any).aadhaarNumber.slice(-4)}` : (lang === 'hi' ? 'सत्यापित नहीं' : 'Not Verified')

  return (
    <div
      className="flex min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-500/20 backdrop-blur-md bg-card/80">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-foreground cursor-pointer border border-slate-500/20">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-md font-black text-sm tracking-tighter">
                HI
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight multicolor-text font-jakarta">
                  Health<span className="text-indigo-500">ID</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-400">Digital Health Identity</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-500/10 text-foreground border border-slate-500/20 hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              <Globe size={15} className="text-indigo-500" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button type="button" onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 text-foreground border border-slate-500/20 cursor-pointer shadow-sm">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <Breadcrumb />

          {/* Action Bar / Side Selector */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-slate-500/20 shadow-md">
              <button
                type="button"
                onClick={() => setCardSide('front')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${cardSide === 'front' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-foreground'}`}
              >
                {lang === 'hi' ? 'सामने का भाग (Front)' : 'Front Side'}
              </button>
              <button
                type="button"
                onClick={() => setCardSide('back')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${cardSide === 'back' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-foreground'}`}
              >
                {lang === 'hi' ? 'पिछला भाग (Back)' : 'Back Side'}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Credit Card Size */}
            <div className="lg:col-span-8 space-y-6">

              {/* FRONT SIDE CARD */}
              <div
                ref={frontCardRef}
                className={`w-full max-w-[520px] aspect-[1.586/1] rounded-[24px] p-5 relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-sky-100/70 to-indigo-100/60 backdrop-blur-2xl border-0 shadow-[0_20px_50px_rgba(30,111,255,0.18)] mx-auto ${cardSide === 'front' ? 'block' : 'hidden'}`}
                style={{ color: '#0f172a' }}
              >
                <div className="absolute bottom-1 right-3 text-[7px] font-mono font-bold tracking-widest text-slate-400/70 pointer-events-none select-none">
                  {user.fullName || 'User'}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md font-black text-xs tracking-tighter">
                      HI
                    </div>
                    <div>
                      <h2 className="text-[11px] font-black tracking-tight font-jakarta bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                        HealthID Card
                      </h2>
                      <p className="text-[8px] font-medium text-slate-500">Your Health. Always Protected.</p>
                    </div>
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                    <CheckCircle size={10} className="text-emerald-500" /> Verified Health Profile
                  </div>
                </div>

                {/* Always Side-by-Side Name & QR Code Container */}
                <div className="print-front-main flex items-center justify-between gap-3 mb-3">

                  <div className="print-front-profile flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-blue-100 to-sky-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        ) : (
                          <span className="text-xl font-black text-blue-600">{user.fullName?.[0] ?? 'U'}</span>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm border border-white text-[9px]">
                        ✓
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate font-jakarta">
                        {user.fullName || '—'}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-500">Digital Health Profile</p>

                      <div className="mt-1.5 flex flex-col items-start gap-0.5">
                        <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">HEALTH ID</span>
                        <div onClick={handleCopyId} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all">
                          <span className="font-mono font-extrabold text-[10px] text-slate-800">{user.healthId || '—'}</span>
                          <Copy size={10} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="print-front-qr flex flex-col items-center justify-center shrink-0">
                    <div className="p-2 rounded-2xl bg-white shadow-md border border-slate-200/90 inline-block relative">
                      <div className="relative">
                        <QRCode
                          value={publicCardUrl}
                          size={72}
                          style={{ display: 'block' }}
                          viewBox="0 0 256 256"
                          level="H"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm border border-white text-[8px] font-black">
                            HI
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[8px] font-bold text-blue-600 text-center mt-1 tracking-tight">Scan to access profile</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-3 pt-2 border-t border-slate-200/60 text-center">
                  <div className="p-1.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5"><Calendar size={9} /><span className="text-[7px] font-bold uppercase">DOB</span></div>
                    <p className="text-[9px] font-black text-slate-900 truncate">{user.dob || '—'}</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5"><User size={9} /><span className="text-[7px] font-bold uppercase">Gender</span></div>
                    <p className="text-[9px] font-black text-slate-900 truncate">{user.gender || '—'}</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5"><Heart size={9} className="text-rose-500" /><span className="text-[7px] font-bold uppercase">Blood</span></div>
                    <p className="text-[9px] font-black text-rose-600 truncate">{user.bloodGroup || '—'}</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5"><Ruler size={9} /><span className="text-[7px] font-bold uppercase">Height</span></div>
                    <p className="text-[9px] font-black text-slate-900 truncate">{user.height ? `${user.height} cm` : '—'}</p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5"><Weight size={9} /><span className="text-[7px] font-bold uppercase">Weight</span></div>
                    <p className="text-[9px] font-black text-slate-900 truncate">{user.weight ? `${user.weight} kg` : '—'}</p>
                  </div>
                </div>

                <div className="print-emergency flex items-center justify-between gap-2 mb-2">
                  <div className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-sm">
                        <Phone size={12} />
                      </div>
                      <div>
                        <p className="text-[8px] font-extrabold text-red-600 uppercase tracking-wider">Emergency Contact</p>
                        <p className="text-[10px] font-extrabold text-slate-900">{primaryContact.name}</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-white shadow-sm border border-slate-200 font-mono text-[10px] font-bold text-slate-800">
                      {primaryContact.phone}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 font-bold text-[10px] shadow-sm">
                    <Lock size={12} className="text-red-500" />
                    <span>Emergency Enabled</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500 pt-1.5 border-t border-slate-200/60">
                  <span>Issued on: {user.registrationDate || '—'}</span>
                  <span className="font-bold text-slate-600">HealthID – Digital Identity</span>
                </div>
              </div>

              {/* BACK SIDE CARD */}
              <div
                ref={backCardRef}
                className={`w-full max-w-[520px] aspect-[1.586/1] rounded-[24px] p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-sky-100/70 to-indigo-100/60 backdrop-blur-2xl border-0 shadow-[0_20px_50px_rgba(30,111,255,0.18)] mx-auto flex flex-col justify-between ${cardSide === 'back' ? 'block' : 'hidden'}`}
                style={{ color: '#0f172a' }}
              >
                <div className="absolute bottom-1 right-3 text-[7px] font-mono font-bold tracking-widest text-slate-400/70 pointer-events-none select-none">
                  {user.fullName || 'User'}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm font-black text-xs">
                        HI
                      </div>
                      <div>
                        <h3 className="text-[11px] font-black text-slate-900 tracking-tight font-jakarta">Official Medical Pass – Back View</h3>
                        <p className="text-[9px] font-medium text-slate-500">Encrypted Clinical Data Summary</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 font-mono">SECURE BACK</span>
                  </div>

                  <div className="print-back-grid grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px]">

                    <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 h-auto flex flex-col justify-between">
                      <p className="font-black text-blue-600 flex items-center gap-1 uppercase">
                        <Activity size={11} /> Medical Summary
                      </p>
                      <ul className="space-y-1 font-medium text-slate-700">
                        <li>✓ {(user.diseases || []).join(', ') || '—'}</li>
                        <li>✓ {user.surgeries || '—'}</li>
                        <li>✓ Insurance: {user.insurance || '—'}</li>
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 h-auto flex flex-col justify-between">
                      <p className="font-black text-rose-600 flex items-center gap-1 uppercase">
                        <AlertCircle size={11} /> Allergies
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-800 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span>Dust Allergy</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-amber-700">{user.dustAllergy ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-800 font-semibold truncate">
                          {allergiesList}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 h-auto flex flex-col justify-between">
                      <p className="font-black text-indigo-600 flex items-center gap-1 uppercase">
                        <Shield size={11} /> Current Medicines
                      </p>
                      <div className="space-y-1">
                        {(user.medicines || []).length === 0 ? (
                          <p className="text-slate-500">—</p>
                        ) : (
                          (user.medicines || []).slice(0, 2).map((m: any, i: number) => (
                            <div key={i} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                              <p className="font-bold text-slate-900">{m.name} ({m.dose || '—'})</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2 text-[9px] mt-2">
                  <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Lock size={10} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Digital health identity card.</p>
                    <p className="text-[8px] text-slate-500">In emergencies, scan QR code to access records securely.</p>
                  </div>
                </div>
              </div>

              {/* Flip Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setCardSide(prev => prev === 'front' ? 'back' : 'front')}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <RotateCw size={15} /> {lang === 'hi' ? `कार्ड पलटें (${cardSide === 'front' ? 'पीछे' : 'सामने'})` : `Flip Card (${cardSide === 'front' ? 'Back Side' : 'Front Side'})`}
                </button>
              </div>

            </div>

            {/* Right Column: Verified Card Details & Download Button */}
            <div className="lg:col-span-4 space-y-6">

              <div className="card p-7 shadow-xl border border-slate-500/20 transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 bg-card rounded-3xl">
                <p className="font-black text-base mb-5 flex items-center gap-2.5 text-foreground font-jakarta">
                  <Shield size={18} className="text-indigo-400" /> {lang === 'hi' ? 'सत्यापित कार्ड विवरण' : 'Verified Card Details'}
                </p>

                <div className="space-y-4 text-sm">
                  {[
                    [lang === 'hi' ? 'पूरा नाम' : 'Full Name', user.fullName || '—'],
                    [lang === 'hi' ? 'हेल्थ आईडी' : 'Health ID', user.healthId ?? '—'],
                    [lang === 'hi' ? 'आधार स्टेटस' : 'Aadhaar Status', maskedAadhaar],
                    [lang === 'hi' ? 'रक्त समूह' : 'Blood Group', user.bloodGroup || '—'],
                    [lang === 'hi' ? 'जन्म तिथि' : 'Date of Birth', user.dob || '—'],
                    [lang === 'hi' ? 'लिंग' : 'Gender', user.gender || '—'],
                    [lang === 'hi' ? 'जारी तिथि' : 'Issue Date', user.registrationDate || '—'],
                    [lang === 'hi' ? 'प्राथमिक आपातकालीन एसओएस' : 'Primary Emergency SOS', primaryContact.phone]
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex items-center justify-between py-2.5 border-b border-slate-500/20 transition-colors hover:bg-slate-500/5 px-2 rounded-xl">
                      <span className="text-xs font-bold text-slate-400">{k}</span>
                      <span className="font-extrabold font-mono text-sm text-foreground">{v || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Download size={18} /> {lang === 'hi' ? 'हेल्थआईडी कार्ड डाउनलोड करें' : 'Download HealthID Card'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full btn-secondary py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Share2 size={15} /> {lang === 'hi' ? 'पास लिंक शेयर करें' : 'Share Pass Link'}
                </button>
              </div>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}