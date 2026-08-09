import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Shield, Activity, Pill, Users, CheckCircle, 
  AlertCircle, Edit3, ArrowLeft, Heart, BarChart3, Lock, FileText, Globe, Sun, Moon 
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'

export default function MedicalOverview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'personal'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()

  const COMPLETION_SECTIONS = [
    { key: 'personal', label: 'Personal Info', check: !!(user?.fullName && user?.dob && user?.phone && user?.email) },
    { key: 'medical', label: 'Medical Info', check: !!(user?.bloodGroup && user?.height && user?.weight) },
    { key: 'allergies', label: 'Allergies', check: !!(user?.foodAllergies?.length || user?.medicineAllergies?.length) },
    { key: 'medicines', label: 'Medicines', check: !!(user?.medicines?.length) },
    { key: 'emergency', label: 'Emergency Contacts', check: !!(user?.emergencyContacts?.length) },
    { key: 'documents', label: 'Medical Documents', check: !!(user?.documents?.length) },
  ]

  const completedCount = COMPLETION_SECTIONS.filter(s => s.check).length
  const completionPct = Math.round((completedCount / COMPLETION_SECTIONS.length) * 100)

  // Reusable Profile Header Component for all tabs (Full Width Optimized)
  const renderProfileHeader = (title: string) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-3xl font-black text-white overflow-hidden shadow-xl shrink-0 border-4 border-white dark:border-slate-800 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user?.fullName?.[0] ?? 'U'
          )}
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
            {user?.fullName || 'User Profile'}
          </h2>
          <p className="text-xs font-mono font-bold tracking-wide mt-1 text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Shield size={14} /> {user?.healthId ?? 'MSHLD-2026-IN'}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{user?.email || 'No email registered'}</p>
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => navigate('/profile')} 
        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-6 flex items-center gap-1.5 shadow-md shrink-0 font-black rounded-xl cursor-pointer transition-all hover:scale-105"
      >
        <Edit3 size={14} /> Edit Details
      </button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                Medical Analytics & Overview
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Comprehensive health metrics, logs, and profile records</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/profile')} 
              className="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-5 items-center gap-2 shadow-lg shadow-emerald-500/25 font-black rounded-xl cursor-pointer transition-all hover:scale-105"
            >
              <Edit3 size={15} /> Edit Profile Records
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <Breadcrumb />

          {/* Professional Graph / Analytics Hero Banner */}
          <div className="p-8 shadow-xl relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-3 gap-8 items-center relative z-10">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black text-white bg-emerald-600 flex items-center gap-1.5 shadow-sm">
                    <BarChart3 size={13} /> Real-time Health Audit
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Lock size={12} /> AES-256 Secured
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                  Profile Completeness: <span className="text-emerald-600 dark:text-emerald-400">{completionPct}%</span>
                </h2>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Select any specific module below to inspect your synchronized records instantly.
                </p>

                {/* Interactive Category Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {COMPLETION_SECTIONS.map((sec) => (
                    <button 
                      key={sec.key} 
                      type="button"
                      onClick={() => navigate(`/medical-overview?tab=${sec.key}`)}
                      className={`p-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm transition-all text-left border cursor-pointer ${
                        activeTab === sec.key ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-400'
                      }`}
                    >
                      {sec.check ? <CheckCircle size={16} className="text-emerald-500 shrink-0" /> : <AlertCircle size={16} className="text-amber-500 shrink-0" />}
                      <span className="text-xs font-bold truncate text-slate-800 dark:text-white">{sec.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Vitality Graph Card Style */}
              <div className="p-6 rounded-3xl shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-600 text-white">
                <Activity size={36} className="mb-2 opacity-90 animate-pulse" />
                <p className="text-xs font-extrabold uppercase tracking-widest text-white/90">Overall Health Index</p>
                <p className="text-5xl font-black tracking-tighter my-2">87<span className="text-2xl font-bold opacity-80">/100</span></p>
                <p className="text-xs font-bold bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">Optimal Vitality Status</p>
              </div>
            </div>
          </div>

          {/* Full Width Dynamic Content Area */}
          <div className="space-y-6 w-full">
            
            {/* 1. Personal Info Section */}
            {activeTab === 'personal' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Personal Information')}
                <div className="space-y-3">
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Full Name</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Health ID</span><span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">{user?.healthId || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Date of Birth</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.dob || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Gender</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.gender || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Phone Number</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.phone || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.email || '—'}</span></div>
                </div>
              </div>
            )}

            {/* 2. Medical Info Section */}
            {activeTab === 'medical' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Medical Information')}
                <div className="space-y-3">
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Blood Group</span><span className="text-sm font-bold text-rose-500">{user?.bloodGroup || '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Height</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.height ? `${user.height} cm` : '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Weight</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.weight ? `${user.weight} kg` : '—'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Chronic Conditions</span><span className="text-sm font-bold text-slate-900 dark:text-white">{(user?.diseases ?? []).join(', ') || 'None recorded'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Surgical History</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.surgeries || 'None'}</span></div>
                </div>
              </div>
            )}

            {/* 3. Allergies Section */}
            {activeTab === 'allergies' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Allergies & Reactions')}
                <div className="space-y-3">
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Food Allergies</span><span className="text-sm font-bold text-slate-900 dark:text-white">{(user?.foodAllergies ?? []).join(', ') || 'None recorded'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Medicine Allergies</span><span className="text-sm font-bold text-slate-900 dark:text-white">{(user?.medicineAllergies ?? []).join(', ') || 'None recorded'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Dust Allergy</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.dustAllergy ? 'Yes' : 'No'}</span></div>
                  <div className="flex justify-between py-4 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner"><span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Allergy Severity</span><span className="text-sm font-bold text-slate-900 dark:text-white">{user?.allergySeverity || '—'}</span></div>
                </div>
              </div>
            )}

            {/* 4. Medicines Section */}
            {activeTab === 'medicines' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Active Prescriptions')}
                {(user?.medicines ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8 font-medium">No active prescriptions added.</p>
                ) : (
                  <div className="space-y-3">
                    {(user?.medicines ?? []).map((med: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{med.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            {[med.morning && '🌅 Morning', med.afternoon && '☀️ Afternoon', med.night && '🌙 Night'].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm">{med.dose}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Emergency Contacts Section */}
            {activeTab === 'emergency' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Emergency SOS Contacts')}
                {(user?.emergencyContacts ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8 font-medium">No emergency contacts saved.</p>
                ) : (
                  <div className="space-y-3">
                    {(user?.emergencyContacts ?? []).map((c: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ background: i === 0 ? '#ef4444' : '#10b981' }}>
                            {c.priority}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{c.relation} · <span className="font-mono">{c.phone}</span></p>
                          </div>
                        </div>
                        {i === 0 && <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-500 shadow-sm">Primary</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. Medical Documents Section */}
            {activeTab === 'documents' && (
              <div className="p-8 shadow-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
                {renderProfileHeader('Secured Medical Reports')}
                {(user?.documents ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8 font-medium">No medical documents uploaded.</p>
                ) : (
                  <div className="space-y-3">
                    {(user?.documents ?? []).map((d: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-cyan-500" />
                          <div><p className="font-bold text-sm text-slate-900 dark:text-white">{d.name}</p><p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{d.type}</p></div>
                        </div>
                        {d.url && <a href={d.url} target="_blank" rel="noreferrer" className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 shadow-sm">View Report</a>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </main>

        <Footer />
      </div>
    </div>
  )
}