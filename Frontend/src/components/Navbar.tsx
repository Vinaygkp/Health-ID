import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, Globe, Menu, X, ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLang, type Lang } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, tr } = useLang()
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  // Close language dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const langs: { code: Lang; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ]

  const navLinks = [
    { href: '/#home', label: tr('home') || 'Home' },
    { href: '/#features', label: tr('features') || 'Features' },
    { href: '/ai-chat', label: tr('aiAssistant') || 'Dr. Vinay (AI)' },
    { href: '/hospitals', label: tr('hospitals') || 'Hospitals' },
    { href: '/#about', label: tr('about') || 'About' },
    { href: '/#contact', label: tr('contact') || 'Contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
        scrolled 
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-b border-emerald-500/20' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with HI Monogram */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white font-black text-base tracking-tighter">
              HI
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-jakarta transition-all duration-300">
                Health<span className="text-emerald-600 dark:text-emerald-400">ID</span>
              </span>
            </div>
          </Link>

          {/* Desktop Links with Smooth Background Hover */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
                    e.preventDefault()
                    navigate(link.href)
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            
            {/* Language Dropdown */}
            <div className="relative hidden sm:block" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Globe size={15} className="text-emerald-500 dark:text-emerald-400" />
                <span className="uppercase">{lang}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 py-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-fadeIn">
                  {langs.map((l) => (
                    <button
                      type="button"
                      key={l.code}
                      onClick={() => {
                        setLang(l.code)
                        setLangOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-left transition-all hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 cursor-pointer ${
                        lang === l.code ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            {/* Auth section */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-2xl transition-all hover:scale-105 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white overflow-hidden shadow-inner bg-gradient-to-br from-emerald-500 to-teal-600">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName?.[0] ?? 'V'
                  )}
                </div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {user?.fullName?.split(' ')[0] || 'Vinay'}
                </span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                {/* 🌟 Day mode mein text red, dark mode mein white */}
                <button 
                  type="button" 
                  onClick={() => navigate('/login')} 
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 dark:text-white font-bold text-xs transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 hover:border-rose-300 dark:hover:border-slate-500"
                >
                  {tr('login') || 'Sign In'}
                </button>
                <button type="button" onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer transition-all duration-300 hover:scale-105">
                  {tr('register') || 'Register'}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer shadow-sm"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-fadeIn transition-colors duration-300">
          <div className="px-5 py-6 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
                    e.preventDefault()
                    navigate(link.href)
                  }
                  setMobileOpen(false)
                }}
                className="block px-4 py-3 rounded-2xl text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all border border-transparent hover:border-emerald-500/30"
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {langs.map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      lang === l.code ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              {isLoggedIn ? (
                <button type="button" onClick={() => navigate('/dashboard')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black w-full py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20">
                  {tr('dashboard') || 'Go to Dashboard'}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button type="button" onClick={() => navigate('/login')} className="py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-rose-50 dark:bg-slate-950 hover:bg-rose-100 text-rose-600 dark:text-white text-xs font-bold cursor-pointer transition-all">
                    {tr('login') || 'Sign In'}
                  </button>
                  <button type="button" onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20">
                    {tr('register') || 'Register'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}