import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Navigation, Star, Clock, ArrowLeft, Bed, HeartPulse, CheckCircle, Stethoscope, Building2, Award } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useToast } from '../components/Toast'
import { useLang } from '../contexts/LanguageContext'
import { MOCK_HOSPITALS } from '../data/hospitalsData'

export default function HospitalDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { lang } = useLang()

  const hospital = MOCK_HOSPITALS.find(h => h.id.toString() === id) || MOCK_HOSPITALS[0]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500 selection:text-white flex flex-col justify-between relative transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Navbar />

      <main className="flex-1 pt-32 pb-16 px-4 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <Breadcrumb />

        <div className="space-y-6 mt-6">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-4 py-2.5 bg-card border border-slate-300 dark:border-slate-500/30 hover:border-slate-500 text-slate-800 dark:text-slate-200 hover:text-foreground inline-flex items-center gap-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft size={16} /> {lang === 'hi' ? 'अस्पतालों पर वापस जाएं' : 'Back to Hospitals'}
          </button>

          {/* Top Banner Card with Hospital Image */}
          <div className="relative rounded-[32px] overflow-hidden bg-card border border-slate-300 dark:border-slate-500/30 shadow-2xl">
            {/* Hospital Image Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img 
                src={hospital.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"} 
                alt={hospital.name} 
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {hospital.type}
                  </span>
                  {hospital.emergency && (
                    <span className="text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> 24/7 Emergency SOS
                    </span>
                  )}
                </div>
                
                <span className="text-xs font-bold flex items-center gap-1 text-amber-300 bg-slate-900/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> {hospital.rating} {lang === 'hi' ? 'रेटिंग' : 'Rating'}
                </span>
              </div>

              {/* Title & Location Over Image */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-jakarta drop-shadow-md">
                  {hospital.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-100 mt-1.5 flex items-center gap-1.5 drop-shadow">
                  <MapPin size={16} className="text-emerald-400 shrink-0" /> {hospital.address}
                </p>
              </div>
            </div>

            {/* Card Body & Quick Stats Info */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-300 dark:border-slate-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs tracking-tighter">
                    HI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{lang === 'hi' ? 'भारतीय स्वास्थ्य नेटवर्क सत्यापित' : 'Indian Healthcare Network Verified'}</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">Ayushman Bharat & HealthID Partner</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
                    📍 {hospital.dist} {lang === 'hi' ? 'दूर' : 'away'}
                  </span>
                  <span className="text-xs font-black text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 rounded-xl">
                    ⏱️ ~{hospital.time} ETA
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => showToast(`Calling Indian Emergency Helpline for ${hospital.name} at ${hospital.phone}...`, 'success')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Phone size={18} /> Call ER ({hospital.phone})
                </button>
                <button 
                  type="button"
                  onClick={() => showToast(`Opening live navigation route in India for ${hospital.name}...`, 'info')}
                  className="bg-card hover:bg-slate-500/10 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-500/30 py-4 px-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Navigation size={18} /> Open GPS Navigation ({hospital.time})
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Status Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-card border border-slate-300 dark:border-slate-500/30 shadow-lg flex items-center gap-4 hover:border-emerald-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bed size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">{lang === 'hi' ? 'उपलब्ध सामान्य बिस्तर' : 'Available General Beds'}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-jakarta">{hospital.beds} Units</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-slate-300 dark:border-slate-500/30 shadow-lg flex items-center gap-4 hover:border-rose-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartPulse size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">{lang === 'hi' ? 'गंभीर आईसीयू यूनिट' : 'Critical ICU Units'}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-jakarta">{hospital.icu} Available</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-slate-300 dark:border-slate-500/30 shadow-lg flex items-center gap-4 hover:border-cyan-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">{lang === 'hi' ? 'औसत ट्रैफिक प्रतिक्रिया' : 'Avg Traffic Response'}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-jakarta">~{hospital.time}</p>
              </div>
            </div>
          </div>

          {/* Detailed Indian Hospital Info & Departments */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[28px] bg-card border border-slate-300 dark:border-slate-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-300 dark:border-slate-500/30">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-jakarta">{lang === 'hi' ? 'अस्पताल अवलोकन' : 'Hospital Overview'}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">NABH Accredited & Govt Approved</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {hospital.name} is one of the premier healthcare institutions in India, offering world-class medical infrastructure, experienced specialists, and advanced diagnostic laboratories equipped to handle critical trauma cases 24/7.
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                <p className="flex items-center gap-2">📞 Direct Helpline: <span className="text-emerald-600 dark:text-emerald-300 font-mono">{hospital.phone}</span></p>
                <p className="flex items-center gap-2">🏥 Facility Type: <span className="text-cyan-600 dark:text-cyan-300">{hospital.type}</span></p>
                <p className="flex items-center gap-2">🇮🇳 Country Standard: <span className="text-amber-600 dark:text-amber-300">Indian Medical Council Guidelines</span></p>
              </div>
            </div>

            <div className="p-8 rounded-[28px] bg-card border border-slate-300 dark:border-slate-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-300 dark:border-slate-500/30">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 flex items-center justify-center">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-jakarta">{lang === 'hi' ? 'आपातकालीन और विशेष डेस्क' : 'Emergency & Special Desks'}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Dedicated Indian helpline extensions</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex justify-between items-center bg-slate-500/5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-500/20">
                  <span>Ambulance Dispatch (National):</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">102 / 108</span>
                </li>
                <li className="flex justify-between items-center bg-slate-500/5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-500/20">
                  <span>Ayushman Bharat Desk:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">Available</span>
                </li>
                <li className="flex justify-between items-center bg-slate-500/5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-500/20">
                  <span>Blood Bank Helpline:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-300 font-bold">Ext. 402</span>
                </li>
                <li className="flex justify-between items-center bg-slate-500/5 p-2.5 rounded-xl border border-slate-300 dark:border-slate-500/20">
                  <span>Dr. Vinay (AI) Case Sync:</span>
                  <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">Active</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Facilities & Departments Grid */}
          <div className="p-8 rounded-[28px] bg-card border border-slate-300 dark:border-slate-500/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-300 dark:border-slate-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-jakarta">{lang === 'hi' ? 'सुविधाएं और चिकित्सा विभाग' : 'Facilities & Medical Departments'}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">Verified Indian medical specialties and emergency units available</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                '24/7 Trauma, Accident & Emergency Care',
                'Advanced Cardiac Life Support (ACLS & Cath Lab)',
                'Govt. Registered Pathology & 24hr Blood Bank',
                'Pediatric & Neonatal Intensive Care Unit (NICU)',
                'Digital Health Record (HealthID) Patient Sync',
                'Jan Aushadhi Generic Pharmacy on Premises',
                'Ayushman Bharat & Cashless Insurance Desk',
                'GPS Ambulance Fleet Dispatch Service'
              ].map((facility, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-500/5 border border-slate-300 dark:border-slate-500/20 hover:border-slate-500/40 transition-colors">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{facility}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}