import { useState, useRef, useEffect, useId } from 'react'
import { Send, Bot, User, RefreshCw, Sparkles, ArrowLeft, Activity, HeartPulse, Stethoscope, Pill, Brain, ShieldCheck, Upload, FileText, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { useLang, type Lang } from '../contexts/LanguageContext'

// 🌐 Dynamic API Base URL with trailing slash cleanup
const API_BASE = (import.meta.env.VITE_API_URL || 'https://health-id.onrender.com/api').replace(/\/+$/, '')

export default function AIChat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { lang, setLang } = useLang()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const fileInputId = useId()

  const langs: { code: Lang; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ]

  // Quick prompt suggestions
  const SUGGESTIONS = [
    { icon: Stethoscope, label: 'Symptom Checker', prompt: 'I have a mild headache and fever. What should I do?' },
    { icon: Pill, label: 'Medicine Info', prompt: 'What are the precautions for Paracetamol 650mg?' },
    { icon: HeartPulse, label: 'Heart Health Tips', prompt: 'How can I maintain healthy blood pressure naturally?' },
    { icon: Brain, label: 'Analyze Stress', prompt: 'What are simple exercises to reduce stress and anxiety?' },
  ]

  // Chat History State
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'there'}! I am Dr. Vinay AI, your advanced clinical assistant powered by Google Gemini. You can chat with me or upload your medical reports (PDF/Images) for instant AI analysis in your preferred language!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  // Scroll internal container smoothly
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, loading])

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error')
        return
      }
      setSelectedFile(file)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => setFilePreview(reader.result as string)
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
      showToast(`Attached: ${file.name}`, 'info')
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const sendQuery = async (userText: string) => {
    if (!userText.trim() && !selectedFile) return

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const displayText = userText + (selectedFile ? ` [Attached Report: ${selectedFile.name}]` : '')
    
    setChatHistory(prev => [...prev, { sender: 'user', text: displayText, time: currentTime }])
    setMessage('')
    setLoading(true)

    const currentFile = selectedFile
    removeFile()

    try {
      const token = localStorage.getItem('medishield-token')
      const formData = new FormData()
      formData.append('message', userText || 'Please analyze this medical report and explain findings in detail.')
      formData.append('lang', lang)
      if (currentFile) {
        formData.append('report', currentFile)
      }

      const res = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData
      })

      const data = await res.json()
      const botReply = data.reply || data.message || 'I received your query, but no response text was returned.'

      setChatHistory(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: botReply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ])
    } catch {
      setChatHistory(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: 'MediShield Neural Link network error or report analysis failed. Please verify backend server status.', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ])
      showToast('AI Engine offline', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuery(message)
  }

  const clearChat = () => {
    setChatHistory([
      { 
        sender: 'bot', 
        text: `Chat session reset. Ask Dr. Vinay AI any medical query or upload a report.`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ])
    showToast('Chat history cleared', 'info')
  }

  const renderBotText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i} className="block min-h-[1.2em]">
        {line}
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-24 pb-8 px-4 lg:px-8 flex flex-col items-center justify-center max-w-5xl w-full mx-auto h-[calc(100vh-60px)]">
        <div className="w-full flex-1 flex flex-col h-full overflow-hidden">
          
          <div className="flex items-center justify-between mb-4 shrink-0 px-1 gap-4">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => navigate(-1)} 
                className="btn-secondary p-2.5 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft size={18} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/25">
                    <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                      <Bot size={22} className="text-indigo-500" />
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
                </div>

                <div>
                  <h1 className="text-sm sm:text-lg font-black flex items-center gap-2 text-foreground tracking-tight font-jakarta">
                    Dr. Vinay AI Assistant <Sparkles size={16} className="text-amber-400" />
                  </h1>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Activity size={12} className="text-emerald-400" /> Google Gemini Clinical & Report Analyzer
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-500/10 border border-slate-500/20 rounded-xl p-1">
                {langs.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lang === l.code ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-foreground'
                    }`}
                    title={l.label}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>

              <button type="button" onClick={clearChat} className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 rounded-xl shadow-sm cursor-pointer">
                <RefreshCw size={13} /> <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          <div className="card flex-1 flex flex-col overflow-hidden border-indigo-500/30 border-t-4 shadow-2xl rounded-3xl bg-card backdrop-blur-2xl relative">
            
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border-b border-slate-500/20 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-indigo-500 shrink-0" />
                <p className="text-xs text-foreground font-medium">
                  <strong className="text-indigo-500 font-bold">HIPAA Compliant Assistant:</strong> Upload reports for instant multi-language analysis.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0 hidden sm:inline-block">
                GEMINI 1.5 REPORT ENGINE
              </span>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-500/5"
            >
              {chatHistory.length <= 2 && (
                <div className="mb-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">Suggested Inquiries:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SUGGESTIONS.map((s, idx) => {
                      const Icon = s.icon
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => sendQuery(s.prompt)}
                          className="p-3.5 rounded-2xl bg-card border border-slate-500/20 hover:border-indigo-500 hover:shadow-lg transition-all text-left group cursor-pointer"
                        >
                          <Icon size={18} className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-foreground">{s.label}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-1">{s.prompt}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex items-end gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-fuchsia-600 text-white' 
                      : 'bg-card border border-slate-500/20 text-indigo-500'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4.5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white rounded-2xl rounded-br-none font-medium shadow-indigo-500/15' 
                        : 'bg-card text-foreground border border-slate-500/20 rounded-2xl rounded-bl-none font-normal'
                    }`}>
                      {msg.sender === 'bot' ? renderBotText(msg.text) : msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1.5 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-end gap-3.5">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-card border border-slate-500/20 text-indigo-500">
                    <Bot size={18} />
                  </div>
                  <div className="px-5 py-3.5 bg-card border border-slate-500/20 rounded-2xl rounded-bl-none flex items-center gap-2.5 shadow-md">
                    <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-slate-400 font-mono ml-2 font-medium">Dr. Vinay AI is analyzing reports/query...</span>
                  </div>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="px-4 py-2 bg-indigo-500/10 border-t border-slate-500/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 truncate">
                  {filePreview ? (
                    <img src={filePreview} alt="preview" className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30" />
                  ) : (
                    <FileText size={18} className="text-indigo-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">Ready for Gemini clinical breakdown ({lang.toUpperCase()})</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-500/20 shrink-0 bg-card">
              <div className="relative flex items-center max-w-4xl mx-auto gap-2">
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,.pdf" 
                  className="hidden" 
                  id={fileInputId} 
                />
                
                <label 
                  htmlFor={fileInputId}
                  className="btn-secondary p-3.5 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer hover:border-indigo-500 transition-all text-indigo-500"
                  title="Upload Medical Report (Image / PDF)"
                >
                  <Upload size={18} />
                </label>

                <div className="relative flex-1">
                  <label htmlFor={inputId} className="sr-only">Describe your symptoms or ask about report</label>
                  <input
                    id={inputId}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={selectedFile ? "Add a note about this report or press send..." : "Ask symptoms, meds, or upload report for analysis..."}
                    className="input-field w-full py-4 pl-5 pr-14 text-xs sm:text-sm bg-slate-500/5 border-slate-500/20 focus:border-indigo-500 text-foreground placeholder-slate-400 rounded-2xl shadow-inner"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={(!message.trim() && !selectedFile) || loading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white hover:opacity-90 disabled:opacity-30 transition-all shadow-md cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}