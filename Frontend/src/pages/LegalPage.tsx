import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'

const LEGAL_DATA: Record<string, { titleEn: string; titleHi: string; subtitleEn: string; subtitleHi: string; sections: { headingEn: string; headingHi: string; bodyEn: string; bodyHi: string }[] }> = {
  '/privacy-policy': {
    titleEn: 'Privacy Policy',
    titleHi: 'गोपनीयता नीति (Privacy Policy)',
    subtitleEn: 'Last updated: August 2026',
    subtitleHi: 'अंतिम अपडेट: अगस्त 2026',
    sections: [
      {
        headingEn: '1. Information We Collect',
        headingHi: '1. हम कौन सी जानकारी एकत्र करते हैं',
        bodyEn: 'We collect personal and medical details such as your name, contact info, blood group, emergency contacts, and synced health records to provide secure digital identity services.',
        bodyHi: 'हम सुरक्षित डिजिटल पहचान सेवाएं प्रदान करने के लिए आपका नाम, संपर्क जानकारी, रक्त समूह, आपातकालीन संपर्क और सिंक किए गए स्वास्थ्य रिकॉर्ड जैसे व्यक्तिगत और चिकित्सा विवरण एकत्र करते हैं।'
      },
      {
        headingEn: '2. Data Security & Encryption',
        headingHi: '2. डेटा सुरक्षा और एन्क्रिप्शन',
        bodyEn: 'All medical data stored on HealthID is protected using industry-standard AES-256 encryption protocols both in transit and at rest.',
        bodyHi: 'HealthID पर संग्रहीत सभी चिकित्सा डेटा पारगमन और विश्राम दोनों समय उद्योग-मानक AES-256 एन्क्रिप्शन प्रोटोकॉल का उपयोग करके सुरक्षित किया जाता है।'
      },
      {
        headingEn: '3. User Control',
        headingHi: '3. उपयोगकर्ता नियंत्रण',
        bodyEn: 'You retain complete ownership of your health records. You can export, update, or permanently delete your data at any time via your account settings.',
        bodyHi: 'आप अपने स्वास्थ्य रिकॉर्ड के पूर्ण मालिक बने रहते हैं। आप अपनी खाता सेटिंग्स के माध्यम से किसी भी समय अपने डेटा को निर्यात, अपडेट या स्थायी रूप से हटा सकते हैं।'
      }
    ]
  },
  '/terms-of-service': {
    titleEn: 'Terms of Service',
    titleHi: 'सेवा की शर्तें (Terms of Service)',
    subtitleEn: 'Standard User Agreement',
    subtitleHi: 'मानक उपयोगकर्ता समझौता',
    sections: [
      {
        headingEn: '1. Acceptance of Terms',
        headingHi: '1. शर्तों की स्वीकृति',
        bodyEn: 'By accessing or using HealthID, you agree to be bound by these Terms of Service and all applicable health data regulations.',
        bodyHi: 'HealthID का उपयोग करके, आप इन सेवा की शर्तों और सभी लागू स्वास्थ्य डेटा नियमों से बंधने के लिए सहमत हैं।'
      },
      {
        headingEn: '2. User Accounts',
        headingHi: '2. उपयोगकर्ता खाते',
        bodyEn: 'You are responsible for maintaining the confidentiality of your credentials and Health ID passkey.',
        bodyHi: 'आप अपनी साख और हेल्थ आईडी पास-की की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं।'
      },
      {
        headingEn: '3. Emergency Usage',
        headingHi: '3. आपातकालीन उपयोग',
        bodyEn: 'The emergency QR dispatch feature is designed to assist first responders by sharing critical medical alerts during crises.',
        bodyHi: 'आपातकालीन क्यूआर डिस्पैच सुविधा संकट के दौरान महत्वपूर्ण चिकित्सा चेतावनियों को साझा करके प्रथम उत्तरदाताओं की सहायता के लिए डिज़ाइन की गई है।'
      }
    ]
  },
  '/hipaa-compliance': {
    titleEn: 'HIPAA & Health Data Compliance',
    titleHi: 'HIPAA और स्वास्थ्य डेटा अनुपालन',
    subtitleEn: 'Security Standards for Medical Records',
    subtitleHi: 'चिकित्सा रिकॉर्ड के लिए सुरक्षा मानक',
    sections: [
      {
        headingEn: '1. Compliance Overview',
        headingHi: '1. अनुपालन अवलोकन',
        bodyEn: 'HealthID adheres strictly to core data safeguarding principles inspired by HIPAA guidelines to ensure patient privacy.',
        bodyHi: 'HealthID रोगी की गोपनीयता सुनिश्चित करने के लिए HIPAA दिशानिर्देशों से प्रेरित मुख्य डेटा सुरक्षा सिद्धांतों का सख्ती से पालन करता है।'
      },
      {
        headingEn: '2. Access Logs',
        headingHi: '2. एक्सेस लॉग',
        bodyEn: 'Every scan of your emergency QR code or record access is securely logged with timestamps and audit trails.',
        bodyHi: 'आपके आपातकालीन क्यूआर कोड के प्रत्येक स्कैन या रिकॉर्ड एक्सेस को टाइमस्टैम्प और ऑडिट ट्रेल के साथ सुरक्षित रूप से लॉग किया जाता है।'
      }
    ]
  },
  '/medical-disclaimer': {
    titleEn: 'Medical Disclaimer',
    titleHi: 'चिकित्सा अस्वीकरण (Medical Disclaimer)',
    subtitleEn: 'Important Clinical Notice',
    subtitleHi: 'महत्वपूर्ण नैदानिक सूचना',
    sections: [
      {
        headingEn: '1. Not a Substitute for Professional Care',
        headingHi: '1. पेशेवर देखभाल का विकल्प नहीं',
        bodyEn: 'HealthID is a digital health identity and record management utility. It does not provide medical diagnosis, treatment, or professional advice.',
        bodyHi: 'HealthID एक डिजिटल हेल्थ आइडेंटिटी और रिकॉर्ड मैनेजमेंट यूटिलिटी है। यह चिकित्सा निदान, उपचार या पेशेवर सलाह प्रदान नहीं करता है।'
      },
      {
        headingEn: '2. Emergency Dispatch',
        headingHi: '2. आपातकालीन प्रेषण',
        bodyEn: 'In case of a severe medical emergency, always contact local emergency services (e.g., 112 / ambulance) immediately.',
        bodyHi: 'गंभीर चिकित्सा आपातकाल के मामले में, हमेशा तुरंत स्थानीय आपातकालीन सेवाओं (जैसे 112 / एम्बुलेंस) से संपर्क करें।'
      }
    ]
  }
}

export default function LegalPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  const pageData = LEGAL_DATA[location.pathname] || LEGAL_DATA['/privacy-policy']

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500 selection:text-white relative transition-colors duration-300"
      style={{ 
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      {/* Top Navigation Bar for Legal Page */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-slate-500/25 backdrop-blur-xl bg-card/80 shadow-md">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-foreground transition-all bg-card px-4 py-2.5 rounded-xl border border-slate-500/20 hover:border-emerald-500/50 cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} /> Back / वापस
        </button>

        {/* Language Switcher Button */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-slate-500/20">
          <button 
            type="button" 
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground'}`}
          >
            English
          </button>
          <button 
            type="button" 
            onClick={() => setLang('hi')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'hi' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-foreground'}`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="p-8 md:p-12 space-y-8 shadow-2xl bg-card border border-slate-500/20 rounded-[32px] relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 border-b border-slate-500/20 pb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
              <Shield size={14} /> Official Documentation / आधिकारिक दस्तावेज़
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground font-jakarta">
              {lang === 'en' ? pageData.titleEn : pageData.titleHi}
            </h1>
            <p className="text-xs font-bold text-slate-400">
              {lang === 'en' ? pageData.subtitleEn : pageData.subtitleHi}
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {pageData.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5 p-6 rounded-2xl bg-slate-500/5 border border-slate-500/10 hover:border-emerald-500/40 transition-all group">
                <h2 className="text-base font-black text-foreground font-jakarta group-hover:text-emerald-500 transition-colors">
                  {lang === 'en' ? sec.headingEn : sec.headingHi}
                </h2>
                <p className="text-sm font-medium text-slate-300 leading-relaxed">
                  {lang === 'en' ? sec.bodyEn : sec.bodyHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}