import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiAlertCircle, FiX, FiInfo } from 'react-icons/fi'

const ToastContext = createContext(null)

const icons = {
  success: FiCheck,
  error: FiAlertCircle,
  info: FiInfo,
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = icons[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl text-white text-sm ${colors[toast.type]}`}
              >
                <Icon size={18} className="mt-0.5 flex-shrink-0" />
                <p className="flex-1">{toast.message}</p>
                <button onClick={() => removeToast(toast.id)} className="p-0.5 hover:opacity-70 transition-opacity">
                  <FiX size={16} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
