import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Shield, Phone, AlertCircle, Heart, Activity, 
  Lock, Globe, Sun, Moon, UserCheck, Calendar, FileText, MapPin, CheckCircle
} from 'lucide-react'
import Footer from '../components/Footer'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'

export default function HealthCardPage() {
  const navigate = useNavigate()
  const { healthId } = useParams()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()
  
  const [publicUser, setPublicUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!healthId) return
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5001/api/health/public/${encodeURIComponent(healthId)}`)
        const data = await response.json()
        if (response.ok && data.success) {
          setPublicUser(data.data || data.user)
        } else {
          setPublicUser(null)
        }
      } catch (error) {
        console.error('Failed to load public health profile:', error)
        setPublicUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicProfile()
  }, [healthId])

  return (
    <div 
      className="min-h-screen flex flex-col justify-between bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      {/* Top Clean Minimal Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 font-black text-xs tracking-tighter">
            HI
          </div>
          <div>
            <span className="font-black text-lg tracking-tight block text-amber-600 dark:text-white font-jakarta">
              Health<span className="text-indigo-600 dark:text-indigo-400">ID</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
              {lang === 'hi' ? 'आपातकालीन डिजिटल स्वास्थ्य पास' : 'Emergency Digital Health Pass'}
            </span>
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

          <button 
            type="button" 
            onClick={toggleTheme} 
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              {lang === 'hi' ? 'सुरक्षित स्वास्थ्य रिकॉर्ड लोड हो रहा है...' : 'Loading Secure Health Record...'}
            </p>
          </div>
        ) : !publicUser ? (
          <div className="p-12 text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-amber-600 dark:text-white font-jakarta">
              {lang === 'hi' ? 'हेल्थ पास नहीं मिला' : 'Health Pass Not Found'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
              {lang === 'hi' ? 'यह Health ID अमान्य है या डेटाबेस में मौजूद नहीं है।' : 'This Health ID is invalid or does not exist in our secure emergency database.'}
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-xs font-black rounded-xl mt-4 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              {lang === 'hi' ? 'होम पेज पर जाएं' : 'Go to Home'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {lang === 'hi' ? '● आपातकालीन रिकॉर्ड सत्यापित' : '● EMERGENCY RECORD VERIFIED'}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    {lang === 'hi' ? 'यह एक आधिकारिक और सुरक्षित डिजिटल हेल्थ प्रोफाइल है।' : 'Official and secure medical identity verified by HealthID.'}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 shadow-inner">
                {publicUser.healthId || healthId}
              </div>
            </div>

            {/* Profile Identity Card */}
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />
              
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/30 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                  {publicUser.profilePhoto ? (
                    <img src={publicUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-jakarta">{publicUser.fullName?.[0] || 'U'}</span>
                  )}
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">{publicUser.fullName}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                      {publicUser.gender || 'Patient'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center shadow-inner">
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'hi' ? 'रक्त समूह' : 'BLOOD GROUP'}</p>
                      <p className="text-base font-black text-rose-500 mt-0.5">{publicUser.bloodGroup || 'A+'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center shadow-inner">
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'hi' ? 'जन्म तिथि' : 'DOB'}</p>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{publicUser.dob || '—'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center shadow-inner">
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'hi' ? 'लंबाई' : 'HEIGHT'}</p>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{publicUser.height ? `${publicUser.height} cm` : '—'}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center shadow-inner">
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{lang === 'hi' ? 'वजन' : 'WEIGHT'}</p>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{publicUser.weight ? `${publicUser.weight} kg` : '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Section */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl space-y-4 transition-colors duration-300">
              <h2 className="text-sm font-extrabold tracking-wider text-rose-500 uppercase flex items-center gap-2">
                <Phone size={16} /> {lang === 'hi' ? 'आपातकालीन संपर्क (SOS Contacts)' : 'Emergency SOS Contacts'}
              </h2>

              {publicUser.emergencyContacts && publicUser.emergencyContacts.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {publicUser.emergencyContacts.map((contact: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{contact.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{contact.relation || 'Family'}</p>
                        <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{contact.phone}</p>
                      </div>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="p-3 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
                      >
                        <Phone size={14} /> Call
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic font-medium">
                  {lang === 'hi' ? 'कोई आपातकालीन संपर्क उपलब्ध नहीं है।' : 'No emergency contacts registered.'}
                </p>
              )}
            </div>

            {/* Allergies & Critical Medical Info */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Allergies Card */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl space-y-3 transition-colors duration-300">
                <h3 className="text-xs font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={15} /> {lang === 'hi' ? 'एलर्जी और संवेदनशीलता' : 'Allergies & Sensitivities'}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1 font-bold">{lang === 'hi' ? 'खाद्य एलर्जी:' : 'Food Allergies:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(publicUser.foodAllergies || []).join(', ') || (lang === 'hi' ? 'कोई ज्ञात खाद्य एलर्जी नहीं' : 'None reported')}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1 font-bold">{lang === 'hi' ? 'दवा एलर्जी:' : 'Medicine Allergies:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {(publicUser.medicineAllergies || []).join(', ') || (lang === 'hi' ? 'कोई ज्ञात दवा एलर्जी नहीं' : 'None reported')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Conditions Card */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl space-y-3 transition-colors duration-300">
                <h3 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={15} /> {lang === 'hi' ? 'पुरानी बीमारियां और स्थितियां' : 'Chronic Conditions & Medical History'}
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 shadow-inner">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-bold">{lang === 'hi' ? 'बीमारियां / स्थितियां:' : 'Diseases / Conditions:'}</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{(publicUser.diseases || []).join(', ') || publicUser.medicalConditions || (lang === 'hi' ? 'कोई नहीं' : 'None reported')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-bold">{lang === 'hi' ? 'सर्जरी / विकलांगता:' : 'Surgeries / Disabilities:'}</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{publicUser.surgeries || publicUser.disabilities || (lang === 'hi' ? 'कोई नहीं' : 'None reported')}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Active Medications */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl space-y-4 transition-colors duration-300">
              <h2 className="text-sm font-extrabold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-2">
                <FileText size={16} /> {lang === 'hi' ? 'सक्रिय दवाइयां (Active Medications)' : 'Active Medications'}
              </h2>

              {publicUser.medicines && publicUser.medicines.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {publicUser.medicines.map((med: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 font-bold">{med.dose || 'Standard dose'}</p>
                      </div>
                      <div className="flex gap-1 text-[10px] font-bold">
                        {med.morning && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">M</span>}
                        {med.afternoon && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">A</span>}
                        {med.night && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">N</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic font-medium">
                  {lang === 'hi' ? 'कोई सक्रिय दवाइयां दर्ज नहीं हैं।' : 'No active medications recorded.'}
                </p>
              )}
            </div>

            {/* Security Footer Notice */}
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Lock size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>{lang === 'hi' ? 'यह डेटा AES-256 एन्क्रिप्शन के साथ सुरक्षित है।' : 'Protected with AES-256 secure medical encryption standards.'}</span>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}