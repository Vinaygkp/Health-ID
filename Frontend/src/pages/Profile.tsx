import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Edit3, Camera, Shield, Activity, Pill, Users, FileText, AlertCircle, CheckCircle, Upload, Trash2, Globe, Sun, Moon } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'


const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang } = useLang()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const docFileRef = useRef<HTMLInputElement>(null)

  const [draft, setDraft] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    bloodGroup: user?.bloodGroup ?? '',
    height: user?.height ?? '',
    weight: user?.weight ?? '',
    profilePhoto: user?.profilePhoto ?? '',
    medicines: user?.medicines ?? [],
    emergencyContacts: user?.emergencyContacts ?? [],
    documents: user?.documents ?? [],
  })

  // Temporary state for adding new Medicine
  const [newMed, setNewMed] = useState({ name: '', dose: '', morning: true, afternoon: false, night: false })
  // Temporary state for adding new Emergency Contact
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', priority: '1' })

  useEffect(() => {
    if (user) {
      setDraft({
        fullName: user.fullName ?? '',
        phone: user.phone ?? '',
        bloodGroup: user.bloodGroup ?? '',
        height: user.height ?? '',
        weight: user.weight ?? '',
        profilePhoto: user.profilePhoto ?? '',
        medicines: user?.medicines ?? [],
        emergencyContacts: user?.emergencyContacts ?? [],
        documents: user?.documents ?? [],
      })
    }
  }, [user])

  const handleSave = async () => {
    await updateProfile(draft)
    setEditing(false)
    showToast(lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!', 'success')
  }

  // 💊 ADD MEDICINE TO DRAFT
  const handleAddMedicine = () => {
    if (!newMed.name.trim() || !newMed.dose.trim()) {
      showToast('Please enter medicine name and dose', 'error')
      return
    }
    setDraft((d: any) => ({
      ...d,
      medicines: [...d.medicines, newMed] as any
    }))
    setNewMed({ name: '', dose: '', morning: true, afternoon: false, night: false })
    showToast('Medicine added to draft. Click "Save Changes" to apply.', 'info')
  }

  // ❌ REMOVE MEDICINE FROM DRAFT
  const handleRemoveMedicine = (index: number) => {
    setDraft(d => ({
      ...d,
      medicines: d.medicines.filter((_, i) => i !== index)
    }))
  }

  // 👥 ADD EMERGENCY CONTACT TO DRAFT
  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      showToast('Please enter contact name and phone number', 'error')
      return
    }
    setDraft((d: any) => ({
      ...d,
      emergencyContacts: [...d.emergencyContacts, newContact] as any
    }))
    setNewContact({ name: '', relation: '', phone: '', priority: String(draft.emergencyContacts.length + 1) })
    showToast('Contact added to draft. Click "Save Changes" to apply.', 'info')
  }

  // ❌ REMOVE EMERGENCY CONTACT FROM DRAFT
  const handleRemoveContact = (index: number) => {
    setDraft(d => ({
      ...d,
      emergencyContacts: d.emergencyContacts.filter((_, i) => i !== index)
    }))
  }

  // 📸 SAFE PROFILE PHOTO UPLOAD
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem('medishield-token')
    if (!token) {
      showToast('Authentication token missing. Please login again.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'profilePhoto')

    try {
      setUploading(true)
      showToast('Uploading photo...', 'info')

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const textResponse = await res.text()
      let data: any
      try {
        data = JSON.parse(textResponse)
      } catch {
        showToast('Server error: Backend crashed or returned HTML instead of JSON.', 'error')
        return
      }

      if (res.ok && data.success) {
        const uploadedUrl = data.url || data.user?.profilePhoto || ''
        setDraft((d) => ({ ...d, profilePhoto: uploadedUrl }))
        await updateProfile({ profilePhoto: uploadedUrl })
        if (fileRef.current) fileRef.current.value = ''
        showToast('Profile photo uploaded and synced successfully!', 'success')
      } else {
        showToast(data.message || 'Photo upload failed', 'error')
      }
    } catch (err) {
      console.error('Upload Error:', err)
      showToast('Failed to connect to upload server', 'error')
    } finally {
      setUploading(false)
    }
  }

  // ❌ REMOVE PROFILE PHOTO
  const handleRemovePhoto = async () => {
    setDraft((d) => ({ ...d, profilePhoto: '' }))
    await updateProfile({ profilePhoto: '' })
    showToast('Profile photo removed successfully!', 'success')
  }

  // 📄 SAFE MEDICAL REPORT / DOCUMENT UPLOAD
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem('medishield-token')
    if (!token) {
      showToast('Authentication token missing. Please login again.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'document')
    formData.append('name', file.name)

    try {
      setUploading(true)
      showToast('Uploading medical report...', 'info')

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const textResponse = await res.text()
      let data: any
      try {
        data = JSON.parse(textResponse)
      } catch {
        showToast('Server error: Check backend terminal for Cloudinary/Multer crash.', 'error')
        return
      }

      if (res.ok && data.success) {
        if (data.user) {
          await updateProfile(data.user)
          setDraft(d => ({ ...d, documents: data.user.documents ?? d.documents }))
        }
        if (docFileRef.current) docFileRef.current.value = ''
        showToast('Medical report uploaded successfully!', 'success')
      } else {
        showToast(data.message || 'Document upload failed', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upload document', 'error')
    } finally {
      setUploading(false)
    }
  }

  // 🗑️ DELETE A SPECIFIC MEDICAL REPORT / DOCUMENT
  const handleDeleteDocument = async (docUrl: string) => {
    const updatedDocuments = draft.documents.filter((doc: any) => doc.url !== docUrl)
    setDraft(d => ({ ...d, documents: updatedDocuments }))
    await updateProfile({ documents: updatedDocuments })
    showToast('Medical report deleted successfully!', 'success')
  }

  const Section = ({ title, icon: Icon, color, children, action }: { title: string; icon: typeof Shield; color: string; children: React.ReactNode; action?: React.ReactNode }) => (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: `${color}15`, color }}>
            <Icon size={18} />
          </div>
          <h3 className="font-black text-base tracking-tight text-amber-600 dark:text-white font-jakarta">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  )

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 last:border-none">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-bold text-right max-w-[60%] truncate text-slate-900 dark:text-white">{value || '—'}</span>
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
        
        {/* Header with Language & Theme Switcher */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-sm">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                {lang === 'hi' ? 'रोगी प्रोफ़ाइल' : 'Patient Profile'}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'अपनी सत्यापित चिकित्सा और व्यक्तिगत साख प्रबंधित करें' : 'Manage your verified medical and personal credentials'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              <Globe size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button type="button" onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            <button 
              type="button" 
              onClick={() => (editing ? handleSave() : setEditing(true))} 
              className={editing ? 'bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-emerald-500/25 font-black rounded-xl cursor-pointer transition-all hover:scale-105' : 'px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm'}
            >
              {editing ? <><CheckCircle size={15} /> {lang === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}</> : <><Edit3 size={15} /> {lang === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</>}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <Breadcrumb />

          {/* Profile Hero Card */}
          <div className="p-6 lg:p-8 shadow-xl relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative">
                  <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl font-black text-white overflow-hidden shadow-xl shrink-0 border-4 border-slate-100 dark:border-slate-800 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 font-jakarta"
                  >
                    {draft.profilePhoto || user?.profilePhoto ? (
                      <img src={draft.profilePhoto || user?.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.fullName?.[0] ?? 'U'
                    )}
                  </div>

                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

                  <button 
                    type="button" 
                    onClick={() => fileRef.current?.click()} 
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform bg-emerald-600 text-white border-2 border-white dark:border-slate-900 cursor-pointer"
                    title="Upload Profile Photo"
                  >
                    <Camera size={15} />
                  </button>
                </div>

                <div className="min-w-0">
                  {editing ? (
                    <input
                      value={draft.fullName}
                      onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                      className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold mb-2 max-w-xs shadow-inner"
                      id="profile-name"
                      name="fullName"
                      placeholder="Full Name"
                    />
                  ) : (
                    <h2 className="text-2xl font-black tracking-tight text-amber-600 dark:text-white font-jakarta">
                      {user?.fullName || '—'}
                    </h2>
                  )}
                  <p className="text-xs font-mono font-bold tracking-wide mt-1 text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Shield size={13} /> {user?.healthId ?? '—'}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{user?.email || '—'}</p>

                  {editing && (draft.profilePhoto || user?.profilePhoto) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="mt-3 text-xs font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1 mx-auto sm:mx-0 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> {lang === 'hi' ? 'फ़ोटो हटाएं' : 'Remove Photo'}
                    </button>
                  )}
                </div>
              </div>

              {/* Vitals Quick Display Box */}
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0">
                {editing ? (
                  <>
                    <div className="text-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-inner">
                      <input
                        value={draft.bloodGroup}
                        onChange={(e) => setDraft((d) => ({ ...d, bloodGroup: e.target.value }))}
                        className="w-16 text-center text-xs font-bold py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        id="blood-group"
                        name="bloodGroup"
                        placeholder="B+"
                      />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">{lang === 'hi' ? 'रक्त' : 'Blood'}</p>
                    </div>
                    <div className="text-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-inner">
                      <input
                        value={draft.height}
                        onChange={(e) => setDraft((d) => ({ ...d, height: e.target.value }))}
                        className="w-16 text-center text-xs font-bold py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        id="height"
                        name="height"
                        placeholder="175"
                      />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">{lang === 'hi' ? 'लंबाई (सेमी)' : 'Height(cm)'}</p>
                    </div>
                    <div className="text-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-inner">
                      <input
                        value={draft.weight}
                        onChange={(e) => setDraft((d) => ({ ...d, weight: e.target.value }))}
                        className="w-16 text-center text-xs font-bold py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        id="weight"
                        name="weight"
                        placeholder="72"
                      />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">{lang === 'hi' ? 'वजन (किग्रा)' : 'Weight(kg)'}</p>
                    </div>
                  </>
                ) : (
                  [
                    [user?.bloodGroup || '—', lang === 'hi' ? 'रक्त समूह' : 'Blood Group'],
                    [user?.height ? `${user.height} cm` : '—', lang === 'hi' ? 'लंबाई' : 'Height'],
                    [user?.weight ? `${user.weight} kg` : '—', lang === 'hi' ? 'वजन' : 'Weight'],
                  ].map(([val, label]) => (
                    <div key={label} className="text-center p-3.5 rounded-2xl shadow-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <p className="font-black text-base tracking-tight text-rose-500">{val}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Grid Information Sections */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Personal Info */}
            <Section title={lang === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'} icon={Shield} color="#6366f1">
              <div className="space-y-1">
                <Row label={lang === 'hi' ? 'जन्म तिथि' : 'Date of Birth'} value={user?.dob ?? ''} />
                <Row label={lang === 'hi' ? 'लिंग' : 'Gender'} value={user?.gender ?? ''} />
                <Row label={lang === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'} value={editing ? draft.phone : (user?.phone ?? '')} />
                {editing && (
                  <div className="py-2">
                    <input
                      value={draft.phone}
                      onChange={(e) => setDraft(d => ({ ...d, phone: e.target.value }))}
                      placeholder="Update Phone Number"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                )}
                <Row label={lang === 'hi' ? 'ईमेल पता' : 'Email Address'} value={user?.email ?? ''} />
                <Row label={lang === 'hi' ? 'आवासीय पता' : 'Residential Address'} value={user?.address ?? ''} />
                <Row label={lang === 'hi' ? 'देश' : 'Country'} value={user?.country ?? ''} />
                <Row label={lang === 'hi' ? 'राष्ट्रीयता' : 'Nationality'} value={user?.nationality ?? ''} />
              </div>
            </Section>

            {/* Medical Info */}
            <Section title={lang === 'hi' ? 'चिकित्सा जानकारी' : 'Medical Information'} icon={Activity} color="#ef4444">
              <div className="space-y-1">
                <Row label={lang === 'hi' ? 'रक्त समूह' : 'Blood Group'} value={user?.bloodGroup ?? ''} />
                <Row label={lang === 'hi' ? 'पुरानी बीमारियां' : 'Chronic Conditions'} value={(user?.diseases ?? []).join(', ')} />
                <Row label={lang === 'hi' ? 'सर्जिकल इतिहास' : 'Surgical History'} value={user?.surgeries ?? ''} />
                <Row label={lang === 'hi' ? 'विकलांगता' : 'Disabilities'} value={user?.disabilities ?? ''} />
                <Row label={lang === 'hi' ? 'पारिवारिक चिकित्सा इतिहास' : 'Family Medical History'} value={user?.familyHistory ?? ''} />
                <Row label={lang === 'hi' ? 'स्वास्थ्य बीमा' : 'Health Insurance'} value={user?.insurance ?? ''} />
              </div>
            </Section>

            {/* Allergies */}
            <Section title={lang === 'hi' ? 'एलर्जी और प्रतिक्रियाएं' : 'Allergies & Reactions'} icon={AlertCircle} color="#f59e0b">
              <div className="space-y-1">
                <Row label={lang === 'hi' ? 'खाद्य एलर्जी' : 'Food Allergies'} value={(user?.foodAllergies ?? []).join(', ')} />
                <Row label={lang === 'hi' ? 'दवा एलर्जी' : 'Medicine Allergies'} value={(user?.medicineAllergies ?? []).join(', ')} />
                <Row label={lang === 'hi' ? 'धूल से एलर्जी' : 'Dust Allergy'} value={user?.dustAllergy ? (lang === 'hi' ? 'हाँ' : 'Yes') : (lang === 'hi' ? 'नहीं' : 'No')} />
                <Row label={lang === 'hi' ? 'अन्य एलर्जी' : 'Other Allergies'} value={user?.otherAllergies ?? ''} />
                <Row label={lang === 'hi' ? 'एलर्जी की गंभीरता' : 'Allergy Severity'} value={user?.allergySeverity ?? ''} />
              </div>
            </Section>

            {/* Medicines with Add/Remove Prescription */}
            <Section 
              title={lang === 'hi' ? 'वर्तमान सक्रिय नुस्खे' : 'Current Active Prescriptions'} 
              icon={Pill} 
              color="#8b5cf6"
            >
              {editing && (
                <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Add New Medicine</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      placeholder="Medicine Name (e.g. Paracetamol)"
                      value={newMed.name}
                      onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <input
                      placeholder="Dose (e.g. 500mg)"
                      value={newMed.dose}
                      onChange={e => setNewMed({ ...newMed, dose: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    + Add to List
                  </button>
                </div>
              )}

              {(editing ? draft.medicines : (user?.medicines ?? [])).length === 0 ? (
                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <Pill size={24} className="mx-auto mb-2 text-indigo-500 opacity-40 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{lang === 'hi' ? 'कोई सक्रिय दवा दर्ज नहीं है' : 'No active medicines recorded'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(editing ? draft.medicines : (user?.medicines ?? [])).map((med: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl flex items-center justify-between shadow-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{med.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {[med.morning && '🌅 Morning', med.afternoon && '☀️ Afternoon', med.night && '🌙 Night'].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full shadow-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">{med.dose}</span>
                        {editing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(i)}
                            className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Emergency Contacts with Add/Remove */}
            <Section 
              title={lang === 'hi' ? 'आपातकालीन एसओएस संपर्क' : 'Emergency SOS Contacts'} 
              icon={Users} 
              color="#f97316"
            >
              {editing && (
                <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Emergency Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      placeholder="Name"
                      value={newContact.name}
                      onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <input
                      placeholder="Relation (e.g. Father)"
                      value={newContact.relation}
                      onChange={e => setNewContact({ ...newContact, relation: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <input
                      placeholder="Phone Number"
                      value={newContact.phone}
                      onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    + Add Emergency Contact
                  </button>
                </div>
              )}

              {(editing ? draft.emergencyContacts : (user?.emergencyContacts ?? [])).length === 0 ? (
                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <Users size={24} className="mx-auto mb-2 text-amber-500 opacity-40" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{lang === 'hi' ? 'कोई आपातकालीन संपर्क सहेजा नहीं गया है' : 'No emergency contacts saved'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(editing ? draft.emergencyContacts : (user?.emergencyContacts ?? [])).map((c: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl flex items-center justify-between shadow-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-md shrink-0" style={{ background: i === 0 ? '#ef4444' : '#10b981' }}>
                          {c.priority || i + 1}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{c.relation} · <span className="font-mono">{c.phone}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm bg-rose-500/15 text-rose-500">Primary</span>
                        )}
                        {editing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(i)}
                            className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Documents with Upload & Delete Option */}
            <Section 
              title={lang === 'hi' ? 'सुरक्षित चिकित्सा रिपोर्ट' : 'Secured Medical Reports'} 
              icon={FileText} 
              color="#06b6d4"
              action={
                <>
                  <input ref={docFileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleDocumentUpload} />
                  <button 
                    type="button" 
                    onClick={() => docFileRef.current?.click()}
                    disabled={uploading}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Upload size={14} /> {lang === 'hi' ? 'रिपोर्ट अपलोड करें' : 'Upload Report'}
                  </button>
                </>
              }
            >
              {(editing ? draft.documents : (user?.documents ?? [])).length === 0 ? (
                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <FileText size={24} className="mx-auto mb-2 text-cyan-500 opacity-40" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{lang === 'hi' ? 'अभी तक कोई चिकित्सा दस्तावेज़ अपलोड नहीं किया गया है' : 'No medical documents uploaded yet'}</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(editing ? draft.documents : (user?.documents ?? [])).map((doc: any, i: number) => (
                    <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-2xl shadow-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-cyan-500/10 text-cyan-500">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{doc.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">{doc.type}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {doc.url && (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors shadow-sm cursor-pointer"
                          >
                            View
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.url)}
                          className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}