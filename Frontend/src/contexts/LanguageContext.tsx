import React, { useState, useEffect, useContext, useCallback, createContext } from 'react'

export type Lang = 'en' | 'hi' | 'es' | 'fr'

type Translations = Record<string, Record<Lang, string>>

export const t: Translations = {
  tagline: { en: 'Your Health. Always Protected.', hi: 'आपका स्वास्थ्य। हमेशा सुरक्षित।', es: 'Tu Salud. Siempre Protegida.', fr: 'Votre Santé. Toujours Protégée.' },
  home: { en: 'Home', hi: 'होम', es: 'Inicio', fr: 'Accueil' },
  features: { en: 'Features', hi: 'विशेषताएं', es: 'Características', fr: 'Fonctionnalités' },
  aiAssistant: { en: 'AI Assistant', hi: 'AI सहायक', es: 'Asistente IA', fr: 'Assistant IA' },
  hospitals: { en: 'Hospitals', hi: 'अस्पताल', es: 'Hospitales', fr: 'Hôpitaux' },
  about: { en: 'About', hi: 'हमारे बारे में', es: 'Acerca de', fr: 'À propos' },
  contact: { en: 'Contact', hi: 'संपर्क', es: 'Contacto', fr: 'Contact' },
  login: { en: 'Login', hi: 'लॉग इन', es: 'Iniciar sesión', fr: 'Connexion' },
  register: { en: 'Register', hi: 'रजिस्टर', es: 'Registrarse', fr: "S'inscrire" },
  heroTitle: { en: 'One QR Code.\nComplete Medical History.\nAccessible Anywhere.', hi: 'एक QR कोड।\nसम्पूर्ण चिकित्सा इतिहास।\nकहीं भी एक्सेस करें।', es: 'Un Código QR.\nHistorial Médico Completo.\nAccesible en Cualquier Lugar.', fr: 'Un Code QR.\nDossier Médical Complet.\nAccessible Partout.' },
  heroSub: { en: 'Your personal digital health identity — secure, smart, and always ready for emergencies.', hi: 'आपकी व्यक्तिगत डिजिटल स्वास्थ्य पहचान — सुरक्षित, स्मार्ट और आपात स्थितियों के लिए हमेशा तैयार।', es: 'Tu identidad digital de salud personal — segura, inteligente y lista para emergencias.', fr: 'Votre identité de santé numérique personnelle — sécurisée, intelligente et toujours prête pour les urgences.' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', es: 'Panel', fr: 'Tableau de bord' },
  profile: { en: 'Profile', hi: 'प्रोफाइल', es: 'Perfil', fr: 'Profil' },
  myQR: { en: 'My QR Code', hi: 'मेरा QR कोड', es: 'Mi Código QR', fr: 'Mon Code QR' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', es: 'Configuración', fr: 'Paramètres' },
  logout: { en: 'Logout', hi: 'लॉग आउट', es: 'Cerrar sesión', fr: 'Déconnexion' },
  welcomeBack: { en: 'Welcome back', hi: 'वापसी पर स्वागत है', es: 'Bienvenido de nuevo', fr: 'Bon retour' },
  healthScore: { en: 'Health Score', hi: 'स्वास्थ्य स्कोर', es: 'Puntuación de Salud', fr: 'Score de Santé' },
  emergencyContacts: { en: 'Emergency Contacts', hi: 'आपातकालीन संपर्क', es: 'Contactos de Emergencia', fr: "Contacts d'Urgence" },
  medicalSummary: { en: 'Medical Summary', hi: 'चिकित्सा सारांश', es: 'Resumen Médico', fr: 'Résumé Médical' },
  medicineReminder: { en: 'Medicine Reminder', hi: 'दवा रिमाइंडर', es: 'Recordatorio de Medicina', fr: 'Rappel Médicaments' },
  recentActivity: { en: 'Recent Activity', hi: 'हालिया गतिविधि', es: 'Actividad Reciente', fr: 'Activité Récente' },
  typeMessage: { en: 'Type your health question...', hi: 'अपना स्वास्थ्य प्रश्न टाइप करें...', es: 'Escribe tu pregunta de salud...', fr: 'Tapez votre question de santé...' },
  send: { en: 'Send', hi: 'भेजें', es: 'Enviar', fr: 'Envoyer' },
  searchHospitals: { en: 'Search hospitals near you...', hi: 'पास के अस्पताल खोजें...', es: 'Buscar hospitales cercanos...', fr: 'Rechercher des hôpitaux proches...' },
}

interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  tr: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  tr: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('medishield-lang') as Lang) ?? 'en'
    } catch {
      return 'en'
    }
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('medishield-lang', l)
    } catch {
      // Storage catch
    }
  }, [])

  const tr = useCallback(
    (key: string): string => {
      return t[key]?.[lang] ?? t[key]?.['en'] ?? key
    },
    [lang]
  )

  return <LanguageContext.Provider value={{ lang, setLang, tr }}>{children}</LanguageContext.Provider>
}

export const useLang = () => useContext(LanguageContext)