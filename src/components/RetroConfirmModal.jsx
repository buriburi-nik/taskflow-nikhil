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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="cmd-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(28, 20, 34, 0.8)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="retro-window"
            style={{ width: '100%', maxWidth: '380px', border: '3px solid var(--dark)', boxShadow: '8px 8px 0 rgba(0,0,0,0.5)' }}
          >
            <div className="retro-window-bar" style={{ background: 'var(--pink)', color: 'white' }}>
              <div className="retro-window-dots">
                <span style={{ background: 'white' }} />
                <span style={{ background: 'rgba(255,255,255,0.5)' }} />
                <span style={{ background: 'rgba(255,255,255,0.2)' }} />
              </div>
              {title.toUpperCase()}
            </div>

            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              <p style={{ 
                fontFamily: 'Space Mono', 
                fontSize: '14px', 
                fontWeight: 700, 
                lineHeight: 1.5, 
                color: 'var(--dark)',
                marginBottom: '24px' 
              }}>
                &gt; {message.toUpperCase()}
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onClose} 
                  className="btn-retro-ghost" 
                  style={{ flex: 1, padding: '12px' }}
                >
                  [ CANCEL ]
                </button>
                <button 
                  onClick={onConfirm} 
                  className="btn-retro" 
                  style={{ flex: 1, padding: '12px', background: 'var(--pink)' }}
                >
                  [ CONFIRM ]
                </button>
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--cream-dark)', 
              padding: '4px 10px', 
              fontSize: '10px', 
              color: 'var(--pink)', 
              fontWeight: 700,
              borderTop: '2px solid var(--dark)',
              letterSpacing: '0.1em'
            }}>
              WARNING: ACTION CANNOT BE UNDONE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
