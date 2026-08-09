import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight, CheckCircle, Code2, Sparkles, Globe } from 'lucide-react'
import { useToast } from './Toast'

const SOCIAL = [
  { 
    label: 'GitHub', 
    svg: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2', 
    href: 'https://github.com' 
  },
  { 
    label: 'LinkedIn', 
    svg: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2z', 
    href: 'https://linkedin.com' 
  },
  { 
    label: 'X (Twitter)', 
    svg: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', 
    href: 'https://twitter.com' 
  },
  { 
    label: 'Instagram', 
    svg: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z', 
    href: 'https://instagram.com' 
  },
]

const SECURITY_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'HIPAA Compliance', to: '/hipaa-compliance' },
  { label: 'Encryption Standards', to: '/privacy-policy' },
  { label: 'Medical Disclaimer', to: '/medical-disclaimer' },
]

export default function Footer() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error')
      return
    }
    setSubscribed(true)
    setEmail('')
    showToast('Subscribed to HealthID newsletter successfully!', 'success')
  }

  return (
    <footer className="border-t border-slate-500/20 select-none transition-colors duration-300 bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter strip */}
        <div className="py-12 border-b border-slate-500/20">
          <div className="p-8 rounded-3xl relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-orange-500/10 dark:from-cyan-500/10 via-amber-500/5 to-fuchsia-500/10 border border-orange-500/20 dark:border-cyan-500/20">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-orange-600 dark:text-cyan-400 bg-orange-500/10 dark:bg-cyan-500/10 mb-3 border border-orange-500/20 dark:border-cyan-500/20">
                <Sparkles size={13} /> Stay Ahead in Healthcare
              </div>
              <h4 className="text-xl font-black tracking-tight mb-1 text-slate-900 dark:text-white font-jakarta">
                Subscribe to HealthID Bulletin
              </h4>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 max-w-md">
                Get weekly clinical insights, health security alerts, and feature updates directly in your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2.5 px-6 py-4 rounded-2xl shadow-sm relative z-10 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <CheckCircle size={18} />
                <span className="text-sm font-extrabold tracking-tight">Successfully Subscribed!</span>
              </div>
            ) : (
              <div className="flex gap-2.5 w-full md:w-auto relative z-10">
                <input
                  id="newsletter-email"
                  name="newsletterEmail"
                  type="email"
                  placeholder="Enter your professional email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  className="input-field flex-1 md:w-72 shadow-inner font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900"
                />
                <button type="button" onClick={handleSubscribe} className="bg-orange-600 dark:bg-cyan-600 hover:bg-orange-500 dark:hover:bg-cyan-500 text-white font-black shrink-0 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 dark:shadow-cyan-500/30 cursor-pointer transition-all">
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand & Creator Details */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white font-black text-base tracking-tighter">
                HI
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-jakarta">
                Health<span className="text-orange-600 dark:text-cyan-400">ID</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm font-bold text-slate-800 dark:text-slate-200">
              Your universal digital health identity — secure, encrypted via AES-256, and instantly accessible during medical emergencies worldwide.
            </p>

            {/* Creator Credit Badge with Portfolio Link */}
            <a 
              href="https://portfolio-4tb6.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-orange-500/30 dark:border-cyan-500/30 shadow-sm bg-orange-500/10 dark:bg-cyan-500/10 hover:scale-105 transition-transform cursor-pointer"
            >
              <Code2 size={16} className="text-orange-600 dark:text-cyan-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Designed & Developed by <span className="text-orange-600 dark:text-cyan-400 font-black underline">Vinay Kumar</span>
              </span>
            </a>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} title={s.label} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-orange-600 dark:hover:bg-cyan-600 hover:text-white shadow-sm border border-slate-500/20 bg-slate-500/10 text-slate-800 dark:text-slate-300 font-bold">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d={s.svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-black text-sm mb-6 uppercase tracking-wider text-orange-600 dark:text-cyan-400 font-jakarta">Navigation</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              {[
                ['Dashboard', '/dashboard'], 
                ['Health Card', '/health-card'], 
                ['Emergency QR', '/qr-code'], 
                ['Settings', '/settings']
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm font-bold transition-colors hover:text-orange-600 dark:hover:text-cyan-400 text-slate-800 dark:text-slate-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Support */}
          <div>
            <h4 className="font-black text-sm mb-6 uppercase tracking-wider text-orange-600 dark:text-cyan-400 font-jakarta">Trust & Security</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              {SECURITY_LINKS.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm font-bold transition-colors hover:text-orange-600 dark:hover:text-cyan-400 text-slate-800 dark:text-slate-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status & Location */}
          <div>
            <h4 className="font-black text-sm mb-6 uppercase tracking-wider text-orange-600 dark:text-cyan-400 font-jakarta">System Status</h4>
            <div className="p-4 rounded-2xl space-y-3 bg-slate-500/10 border border-slate-500/20">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
              </div>
              <p className="text-[11px] font-bold leading-relaxed text-slate-800 dark:text-slate-300">
                Cloud nodes active across Ghaziabad & global edge servers.
              </p>
              <div className="pt-2 border-t border-slate-500/20 flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-300">
                <Globe size={12} /> Version 2.5.0-PRO
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-slate-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs font-bold flex items-center justify-center sm:justify-start gap-1.5 text-slate-800 dark:text-slate-300">
            Crafted with <Heart size={13} className="text-rose-500 fill-rose-500 animate-pulse" /> by <a href="https://portfolio-4tb6.vercel.app" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-cyan-400 font-black underline hover:opacity-80">Vinay Kumar</a> · 
            <span>© {new Date().getFullYear()} HealthID. All Rights Reserved.</span>
          </p>
          <div className="flex gap-6">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Secure Node: IN-NCR-01</span>
          </div>
        </div>

      </div>
    </footer>
  )
}