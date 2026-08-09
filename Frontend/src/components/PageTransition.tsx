import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [currentKey, setCurrentKey] = useState(location.pathname)

  useEffect(() => {
    // Fade out briefly on path change
    setVisible(false)
    
    const timer = setTimeout(() => {
      setCurrentKey(location.pathname)
      setVisible(true)
    }, 60)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div
      key={currentKey}
      className={`min-h-screen w-full transition-all duration-300 ease-out will-change-[opacity,transform] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      }`}
    >
      {children}
    </div>
  )
}