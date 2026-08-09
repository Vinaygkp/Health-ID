import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, IdCard, QrCode, Settings, LogOut, Shield, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth()
  const { lang, setLang } = useLang()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', to: '/dashboard', icon: LayoutDashboard },
    { labelEn: 'Profile', labelHi: 'प्रोफ़ाइल', to: '/profile', icon: User },
    { labelEn: 'Health Card', labelHi: 'हेल्थ कार्ड', to: '/health-card', icon: IdCard },
    { labelEn: 'My QR Code', labelHi: 'मेरा क्यूआर कोड', to: '/qr-code', icon: QrCode },
    { labelEn: 'Settings', labelHi: 'सेटिंग्स', to: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 bg-card border-r border-slate-500/20 text-foreground ${
        collapsed ? 'w-20' : 'w-76'
      } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-500/20">
          <div className={`flex items-center gap-3.5 overflow-hidden ${collapsed ? 'hidden lg:flex lg:justify-center lg:w-full' : ''}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg shadow-indigo-500/30 bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600">
              <Shield size={22} />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-black text-xl tracking-tight block multicolor-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  MediShield AI
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Secure Health ID</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center bg-slate-500/10 text-slate-400 hover:text-foreground hover:bg-slate-500/20 transition-all cursor-pointer shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Mini Profile Card */}
        {!collapsed && (
          <div className="p-4 m-4 rounded-2xl shadow-sm relative overflow-hidden bg-slate-500/10 border border-slate-500/20">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-md overflow-hidden border border-slate-500/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.[0] ?? 'U'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold truncate tracking-tight text-foreground">{user?.fullName ?? 'User'}</p>
                <p className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 truncate mt-0.5">{user?.healthId ?? 'MSHLD-2026-IN'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                title={collapsed ? (lang === 'hi' ? item.labelHi : item.labelEn) : undefined}
                className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  collapsed ? 'justify-center px-2' : ''
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/40 scale-[1.02]' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-500/10'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="tracking-tight truncate">{lang === 'hi' ? item.labelHi : item.labelEn}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Language Switcher & Logout Section */}
        <div className="p-4 border-t border-slate-500/20 space-y-3">
          {!collapsed ? (
            <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-500/10 border border-slate-500/20">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Globe size={16} className="text-indigo-500 dark:text-indigo-400" />
                <span>{lang === 'hi' ? 'भाषा' : 'Language'}</span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-foreground'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'hi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-foreground'}`}
                >
                  हिं
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="w-full flex items-center justify-center p-2.5 rounded-xl bg-slate-500/10 text-indigo-500 font-bold text-xs border border-slate-500/20 hover:bg-slate-500/20 transition-all cursor-pointer"
              title="Switch Language"
            >
              {lang.toUpperCase()}
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? (lang === 'hi' ? 'लॉग आउट' : 'Logout') : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer ${
              collapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span className="tracking-tight">{lang === 'hi' ? 'लॉग आउट' : 'Logout'}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}