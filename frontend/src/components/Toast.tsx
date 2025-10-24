import { useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastCounter = 0
const toastListeners: ((toast: Toast) => void)[] = []

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = {
    id: toastCounter++,
    message,
    type,
  }
  toastListeners.forEach(listener => listener(toast))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, 4000)
    }

    toastListeners.push(listener)
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) toastListeners.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-md
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-right-full
            ${toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <span className="text-2xl">✅</span>}
            {toast.type === 'error' && <span className="text-2xl">❌</span>}
            {toast.type === 'warning' && <span className="text-2xl">⚠️</span>}
            {toast.type === 'info' && <span className="text-2xl">ℹ️</span>}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
