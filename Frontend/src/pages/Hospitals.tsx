import { useState } from 'react'
import { MapPin, Search, Star, Phone, Navigation, Activity, Globe, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useToast } from '../components/Toast'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { MOCK_HOSPITALS } from '../data/hospitalsData'

export default function Hospitals() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()

  const handleCall = (e: React.MouseEvent, name: string, phone: string) => {
    e.stopPropagation()
    showToast(`Calling Indian Emergency Helpline for ${name} (${phone})...`, 'success')
  }

  const handleMap = (e: React.MouseEvent, name: string, time: string) => {
    e.stopPropagation()
    showToast(`Opening live Indian GPS Navigation route (~${time} ETA) for ${name}...`, 'info')
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500 selection:text-white flex flex-col justify-between relative transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Navbar />

      <main className="flex-1 pt-32 pb-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <Breadcrumb />
        
        <div className="space-y-8 mt-6">
          <div className="p-8 rounded-[28px] bg-card border border-slate-300 dark:border-slate-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                {lang === 'hi' ? 'सत्यापित भारतीय चिकित्सा केंद्र' : 'Verified Indian Medical Centers (Proximity Ordered)'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 font-jakarta">
                {lang === 'hi' ? 'आसपास के अस्पताल (भारत)' : 'Nearby Hospitals (India)'} <Activity size={28} className="text-rose-500 animate-pulse" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {lang === 'hi' ? 'आपके स्थान से निकटता के आधार पर शीर्ष सत्यापित आपातकालीन अस्पताल।' : 'Showing top verified emergency hospitals measured by proximity from your location.'}
              </p>
            </div>

            <div className="relative w-full md:w-80 z-10">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'hi' ? 'अस्पताल, शहर या विशेषता खोजें...' : 'Search hospital, city or specialty...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-slate-300 dark:border-slate-500/30 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_HOSPITALS.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase())).map((hospital) => (
              <div 
                key={hospital.id} 
                onClick={() => navigate(`/hospital/${hospital.id}`)}
                className="group rounded-[28px] bg-card border border-slate-300 dark:border-slate-500/30 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-1.5 overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={hospital.image} 
                    alt={hospital.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-slate-700 px-3 py-1 rounded-full">
                      {hospital.type}
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-slate-950/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full shadow">
                      📍 {hospital.dist}
                    </span>
                  </div>

                  {hospital.emergency && (
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] px-3 py-1 rounded-full font-black bg-rose-500/20 text-rose-300 uppercase tracking-widest flex items-center gap-1.5 border border-rose-500/30 backdrop-blur-md">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> 24/7 Emergency SOS
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors font-jakarta truncate">
                        {hospital.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate mb-4">{hospital.address}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold flex items-center gap-1 text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
                        <Star size={12} className="fill-amber-400 text-amber-400" /> {hospital.rating} {lang === 'hi' ? 'रेटिंग' : 'Rating'}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-500/10 px-2.5 py-0.5 rounded-lg border border-slate-300 dark:border-slate-500/30">
                        🛏️ {hospital.beds} {lang === 'hi' ? 'बिस्तर' : 'Beds'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-300 dark:border-slate-500/30">
                    <button 
                      type="button"
                      onClick={(e) => handleCall(e, hospital.name, hospital.phone)} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-105"
                    >
                      <Phone size={14} /> Call ER
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => handleMap(e, hospital.name, hospital.time)} 
                      className="bg-card hover:bg-slate-500/10 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-500/30 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
                    >
                      <Navigation size={14} /> {hospital.time} ETA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}