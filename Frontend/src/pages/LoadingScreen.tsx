import { useEffect, useState, useMemo } from 'react'

interface Props {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: Props) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = useMemo(
    () => [
      'Establishing Secure Neural Health Link...',
      'Decrypting Biometric & Vital Records...',
      'Synchronizing HealthID Emergency Vault...',
      'System Ready — Launching HealthID...',
    ],
    []
  )

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += 1.2
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(onDone, 400)
      }
      setProgress(Math.min(p, 100))
      setPhase(Math.floor((Math.min(p, 100) / 100) * (phases.length - 1)))
    }, 50)

    return () => clearInterval(interval)
  }, [onDone, phases])

  // Particles effect
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: i % 2 === 0 ? '#06b6d4' : '#a855f7',
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
      dx: (Math.random() - 0.5) * 40,
      dy: (Math.random() - 0.5) * 40,
    }))
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden select-none text-white bg-[#030712]"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      
      {/* Keyframes and 3D styles */}
      <style>{`
        @keyframes starRun {
          0% {
            transform: translate(0px, 0px) scale(0.8);
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--move-x), var(--move-y)) scale(1.2);
            opacity: 0;
          }
        }
        .star-particle {
          animation: starRun var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        .text-3d {
          text-shadow: 
            0 1px 0 #005f73, 
            0 2px 0 #005f73, 
            0 3px 0 #0a9396, 
            0 4px 0 #0a9396, 
            0 5px 0 #94d2bd, 
            0 6px 1px rgba(0,0,0,0.1), 
            0 0 20px rgba(6,182,212,0.8),
            0 0 40px rgba(168,85,247,0.6);
          transform: perspective(500px) rotateX(15deg) rotateY(-10deg);
          animation: float3D 3s ease-in-out infinite alternate;
        }
        @keyframes float3D {
          0% {
            transform: perspective(500px) rotateX(10deg) rotateY(-10deg) translateY(0px);
          }
          100% {
            transform: perspective(500px) rotateX(15deg) rotateY(-5deg) translateY(-8px);
          }
        }
      `}</style>

      {/* Background Starry Particle Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(({ id, x, y, size, opacity, color, duration, delay, dx, dy }) => (
          <div
            key={id}
            className="absolute rounded-full star-particle"
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                opacity: opacity,
                boxShadow: `0 0 ${size * 4}px ${color}`,
                '--move-x': `${dx}vw`,
                '--move-y': `${dy}vh`,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Central Content Container */}
      <div className="relative flex flex-col items-center z-10 space-y-8 max-w-md w-full">
        
        {/* Large Glowing Circle with 3D 'HI' Text */}
        <div className="relative w-44 h-44 rounded-full flex items-center justify-center p-1 bg-gradient-to-tr from-cyan-500/50 via-teal-500/20 to-purple-500/50 shadow-[0_0_70px_rgba(6,182,212,0.35)] animate-pulse">
          <div className="w-full h-full rounded-full bg-[#040710] border border-cyan-500/40 flex items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* Background radar spin inside circle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 to-transparent animate-spin" style={{ animationDuration: '10s' }} />

            {/* 3D Rendered 'HI' Text */}
            <div className="relative z-20 text-6xl font-black tracking-wider font-jakarta text-3d bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              HI
            </div>

          </div>
        </div>

        {/* Thought / Subtitle */}
        <div className="text-center space-y-1">
          <p className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-300 drop-shadow uppercase font-jakarta">
            "Your Health. One Identity."
          </p>
        </div>

        {/* Loading Bar & Progress */}
        <div className="w-full flex flex-col items-center space-y-3 mt-1">
          
          <div className="flex justify-between w-full text-xs font-mono tracking-[0.25em] uppercase text-slate-400 font-bold">
            <span>LOADING HEALTHID...</span>
            <span className="text-cyan-400 font-black">{Math.round(progress)}%</span>
          </div>

          {/* Gradient Progress Line */}
          <div className="w-full h-[5px] rounded-full bg-slate-900 overflow-hidden shadow-inner border border-slate-800">
            <div
              className="h-full transition-all duration-75 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)',
                boxShadow: '0 0 18px rgba(6, 182, 212, 0.9)',
              }}
            />
          </div>

          <p className="text-xs font-semibold text-slate-400 pt-2 text-center truncate w-full tracking-wide">
            {phases[phase]}
          </p>
        </div>

      </div>

    </div>
  )
}