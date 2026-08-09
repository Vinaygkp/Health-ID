import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/Toast'
import PageTransition from './components/PageTransition'

import LoadingScreen from './pages/LoadingScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RegistrationSuccess from './pages/RegistrationSuccess'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import QRPage from './pages/QRPage'
import HealthCard from './pages/HealthCard'
import PublicHealthCard from './pages/PublicHealthCard'
import AIChat from './pages/AIChat'
import Hospitals from './pages/Hospitals'
import HospitalDetails from './pages/HospitalDetails'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import MedicalOverview from './pages/MedicalOverview' 
import LegalPage from './pages/LegalPage'
import Contact from './pages/Contact'

// Automatically scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        {/* Public Landing & Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<RegistrationSuccess />} />

        {/* Dedicated App Features */}
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospital/:id" element={<HospitalDetails />} />

        <Route path="/privacy-policy" element={<LegalPage />} />
        <Route path="/terms-of-service" element={<LegalPage />} />
        <Route path="/hipaa-compliance" element={<LegalPage />} />
        <Route path="/medical-disclaimer" element={<LegalPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* 📲 Public Emergency QR Scanner Landing Page (No Login Required) */}
        <Route path="/health/:healthId" element={<PublicHealthCard />} />
        <Route path="/health-card/public/:healthId" element={<PublicHealthCard />} />

        {/* Protected User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-overview"
          element={
            <ProtectedRoute>
              <MedicalOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr-code"
          element={
            <ProtectedRoute>
              <QRPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-card"
          element={
            <ProtectedRoute>
              <HealthCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollToTop />
              {loading && <LoadingScreen onDone={() => setLoading(false)} />}
              <div
                style={{
                  opacity: loading ? 0 : 1,
                  pointerEvents: loading ? 'none' : 'auto',
                  transition: 'opacity 0.4s ease',
                }}
              >
                <AppRoutes />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}