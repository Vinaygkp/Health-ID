import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 select-none bg-black/55 backdrop-blur-md"
      onClick={onCancel}
    >
      <div
        className="card p-7 w-full max-w-sm animate-fadeInUp bg-card border border-slate-500/20 shadow-2xl rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              danger ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-foreground transition-colors p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <h3 className="text-lg font-bold mb-2 text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-sm leading-relaxed mb-7 text-slate-500 dark:text-slate-400">
          {message}
        </p>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-secondary flex-1 py-3 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center cursor-pointer text-white ${
              danger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}