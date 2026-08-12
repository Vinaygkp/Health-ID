import React, { useState, useEffect, useContext, useCallback, createContext } from 'react'

export interface UserProfile {
  // Step 1 - Personal
  aadhaarNumber?: string;
  isAadhaarVerified?: boolean;
  profilePhoto?: string
  fullName: string
  dob: string
  gender: string
  phone: string
  email: string
  address: string
  country: string
  state: string
  district: string
  pincode: string
  nationality: string
  // Step 2 - Medical
  bloodGroup: string
  height: string
  weight: string
  diseases: string[]
  medicalConditions: string
  surgeries: string
  disabilities: string
  familyHistory: string
  insurance: string
  // Step 3 - Allergies
  foodAllergies: string[]
  medicineAllergies: string[]
  dustAllergy: boolean
  otherAllergies: string
  allergySeverity: string
  // Step 4 - Medicines
  medicines: { name: string; dose: string; morning: boolean; afternoon: boolean; night: boolean; prescription: string }[]
  // Step 5 - Emergency Contacts
  emergencyContacts: { name: string; relation: string; phone: string; whatsapp: string; email: string; priority: number }[]
  // Step 6 - Documents
  documents: { type: string; name: string; url: string }[]
  // Generated
  healthId: string
  registrationDate: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  isFirstLogin: boolean
  login: (email: string, password: string) => Promise<boolean>
  sendOtp: (email: string) => Promise<{ success: boolean; message?: string; demoOtp?: string }>
  verifyOtp: (email: string, otp: string) => Promise<boolean>
  sendMobileOtp: (email: string, phone: string) => Promise<{ success: boolean; message?: string; demoMobileOtp?: string }>
  verifyMobileOtp: (email: string, otp: string) => Promise<boolean>
  register: (profile: Partial<UserProfile>) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  setFirstLoginDone: () => void
}

// 🌐 Dynamic API Base URL with fallback
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '')

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isFirstLogin: false,
  login: async () => false,
  sendOtp: async () => ({ success: false }),
  verifyOtp: async () => false,
  sendMobileOtp: async () => ({ success: false }),
  verifyMobileOtp: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => {},
  setFirstLoginDone: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('medishield-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('medishield-token')
    } catch {
      return false
    }
  })

  const [isFirstLogin, setIsFirstLogin] = useState(false)

  // 🚪 Logout Handler
  const logout = useCallback(() => {
    setUser(null)
    setIsLoggedIn(false)
    setIsFirstLogin(false)
    try {
      localStorage.removeItem('medishield-user')
      localStorage.removeItem('medishield-token')
    } catch {
      // Storage restriction catch
    }
  }, [])

  // 🔄 Fresh Profile Fetch & Google Token Capture on Mount
  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        // 🛠️ 1. Check if token came from Google OAuth redirect in URL query params
        const queryParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = queryParams.get('token')

        if (tokenFromUrl) {
          localStorage.setItem('medishield-token', tokenFromUrl)
          // Clean the URL query params without reloading the page
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        const token = tokenFromUrl || localStorage.getItem('medishield-token')
        if (!token) return

        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const freshData = await res.json()
          const userData = freshData.user || freshData
          setUser(userData)
          localStorage.setItem('medishield-user', JSON.stringify(userData))
          setIsLoggedIn(true)

          // 🛠️ 2. Google Signup Flow Check: Agar user ki medical details (bloodGroup) nahi bhari hain, 
          // toh use seedha details form (/profile) par bhej dein, dashboard par nahi!
          if (tokenFromUrl && (!userData.bloodGroup || userData.bloodGroup.trim() === '')) {
            window.location.href = '/profile'
          }
        } else {
          logout()
        }
      } catch (err) {
        console.error('Failed to sync profile from backend:', err)
      }
    }

    fetchFreshProfile()
  }, [logout])

  // 🔑 Password Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Login Failed:', data.message)
        return false
      }

      localStorage.setItem('medishield-token', data.token)
      localStorage.setItem('medishield-user', JSON.stringify(data.user))

      setUser(data.user)
      setIsLoggedIn(true)
      setIsFirstLogin(true)
      return true
    } catch (error) {
      console.error('Backend Login API Error:', error)
      return false
    }
  }

  // 📩 Send Email OTP
  const sendOtp = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      return {
        success: res.ok && data.success,
        message: data.message,
        demoOtp: data.demoOtp,
      }
    } catch (error) {
      console.error('Send OTP Error:', error)
      return { success: false, message: 'Failed to send OTP' }
    }
  }

  // 📲 Verify Email OTP
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Verify OTP Failed:', data.message)
        return false
      }

      const token = data.token || data.accessToken || 'fallback-token-' + Date.now()
      const userData = data.user || data.profile || {
        fullName: email.split('@')[0],
        email: email,
        healthId: `MSHLD-${new Date().getFullYear()}-IN-${Math.floor(100000 + Math.random() * 900000)}`,
        registrationDate: new Date().toISOString().split('T')[0],
        diseases: [],
        medicines: [],
        emergencyContacts: [],
        documents: [],
        foodAllergies: [],
        medicineAllergies: [],
        dustAllergy: false,
      }

      localStorage.setItem('medishield-token', token)
      localStorage.setItem('medishield-user', JSON.stringify(userData))

      setUser(userData)
      setIsLoggedIn(true)
      setIsFirstLogin(true)

      return true
    } catch (error) {
      console.error('Verify OTP Error:', error)
      return false
    }
  }

  // 📱 Send Mobile SMS OTP
  const sendMobileOtp = async (email: string, phone: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/send-mobile-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })
      const data = await res.json()
      return {
        success: res.ok && data.success,
        message: data.message,
        demoMobileOtp: data.demoMobileOtp,
      }
    } catch (error) {
      console.error('Send Mobile OTP Error:', error)
      return { success: false, message: 'Failed to send Mobile OTP' }
    }
  }

  // 📲 Verify Mobile SMS OTP
  const verifyMobileOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-mobile-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      return res.ok && data.success
    } catch (error) {
      console.error('Verify Mobile OTP Error:', error)
      return false
    }
  }

  // 📝 Register API
  const register = async (profile: Partial<UserProfile>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Registration Failed:', data.message)
        return false
      }

      localStorage.setItem('medishield-token', data.token)
      localStorage.setItem('medishield-user', JSON.stringify(data.user))

      setUser(data.user)
      setIsLoggedIn(true)
      setIsFirstLogin(true)
      return true
    } catch (error) {
      console.error('Backend Registration API Error:', error)
      return false
    }
  }

  // ✏️ Update Profile API
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!localStorage.getItem('medishield-token')) {
        setUser((prev) => (prev ? { ...prev, ...updates } : (updates as UserProfile)))
        return
      }

      const token = localStorage.getItem('medishield-token')
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      const data = await res.json()

      if (res.ok) {
        const updatedUser = data.user || data
        setUser((prev) => {
          const merged = prev ? { ...prev, ...updatedUser } : updatedUser
          localStorage.setItem('medishield-user', JSON.stringify(merged))
          return merged
        })
      } else {
        setUser((prev) => {
          const merged = prev ? { ...prev, ...updates } : (updates as UserProfile)
          localStorage.setItem('medishield-user', JSON.stringify(merged))
          return merged
        })
      }
    } catch (error) {
      console.error('Backend Profile Update Error:', error)
      setUser((prev) => {
        const merged = prev ? { ...prev, ...updates } : (updates as UserProfile)
        localStorage.setItem('medishield-user', JSON.stringify(merged))
        return merged
      })
    }
  }

  const setFirstLoginDone = () => setIsFirstLogin(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isFirstLogin,
        login,
        sendOtp,
        verifyOtp,
        sendMobileOtp,
        verifyMobileOtp,
        register,
        logout,
        updateProfile,
        setFirstLoginDone,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)