import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6fc] dark:bg-[#030712] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      <Navbar />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none bg-gradient-to-tr from-emerald-500 to-purple-500 blur-[120px]" />

      <div className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        <div className="text-center animate-fadeInUp max-w-lg">
          {/* Illustration */}
          <div className="relative mb-12 flex justify-center">
            <div
              className="text-[120px] font-black leading-none select-none flex items-center justify-center"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">4</span>
              <span className="animate-float inline-block">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-2"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #06b6d4, #6366f1)',
                    display: 'inline-flex',
                    verticalAlign: 'middle',
                    boxShadow: '0 8px 40px rgba(16,185,129,0.3)',
                  }}
                >
                  <Shield size={40} className="text-white" />
                </div>
              </span>
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">4</span>
            </div>
          </div>

          <h1
            className="text-3xl font-black mb-3 text-amber-600 dark:text-white font-jakarta tracking-tight"
          >
            Page not found
          </h1>
          <p className="text-sm sm:text-base mb-10 text-purple-700 dark:text-slate-400 font-medium leading-relaxed">
            The health record or page you're looking for has moved or doesn't exist on HealthID.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm hover:scale-105 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
            >
              <Home size={16} /> Back to Home
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}