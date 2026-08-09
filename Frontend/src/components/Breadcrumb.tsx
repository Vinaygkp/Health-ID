import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const LABELS: Record<string, string> = {
  '': 'Home',
  dashboard: 'Dashboard',
  profile: 'Profile',
  'qr-code': 'My QR Code',
  'ai-chat': 'AI Assistant',
  hospitals: 'Hospitals',
  hospital: 'Hospital Details',
  settings: 'Settings',
  'health-card': 'Health Card',
  login: 'Login',
  register: 'Register',
  success: 'Success',
  contact: 'Contact',
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return null

  const crumbs = [
    { label: 'Home', to: '/' },
    ...segments.map((seg, i) => {
      // If segment is a number or ID, display it nicely or as 'Details'
      let label = LABELS[seg]
      if (!label) {
        if (/^\d+$/.test(seg)) {
          label = `Record #${seg}`
        } else {
          label = seg.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        }
      }

      return {
        label,
        to: '/' + segments.slice(0, i + 1).join('/'),
      }
    }),
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-4 select-none">
      <ol className="flex items-center gap-2 text-xs flex-wrap list-none p-0 m-0">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1

          return (
            <li key={`${crumb.to}-${i}`} className="flex items-center gap-2">
              {i === 0 && <Home size={13} className="text-indigo-500 dark:text-indigo-400" />}
              {isLast ? (
                <span className="font-bold text-xs text-foreground tracking-tight px-2.5 py-1 rounded-xl bg-slate-500/10 border border-slate-500/20 shadow-sm" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="font-extrabold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:underline underline-offset-4"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight size={13} className="text-slate-400/60 dark:text-slate-600 shrink-0" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}