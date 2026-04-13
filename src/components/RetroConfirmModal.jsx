import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function RetroConfirmModal({ isOpen, onClose, onConfirm, title = 'CONFIRM ACTION', message }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="val-card"
            style={{ width: '100%', maxWidth: '400px', padding: 0 }}
          >
            <div style={{ background: 'var(--val-red)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Anton', fontSize: '24px', letterSpacing: '0.05em' }}>{title.toUpperCase()}</span>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, lineHeight: 1.4, color: 'var(--val-dark)', marginBottom: '32px' }}>
                {message}
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={onClose} className="val-btn secondary" style={{ flex: 1, fontSize: '16px' }}>
                  CANCEL
                </button>
                <button onClick={onConfirm} className="val-btn" style={{ flex: 1, fontSize: '16px' }}>
                  CONFIRM
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
