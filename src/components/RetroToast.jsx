import toast, { resolveValue } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export default function RetroToast({ t }) {
  const isError   = t.type === 'error'
  const isSuccess = t.type === 'success'
  
  let color = 'var(--purple)'
  let label = 'SYSTEM MESSAGE'
  let Icon  = Info

  if (isError) {
    color = 'var(--pink)'
    label = 'ERROR DETECTED'
    Icon  = AlertCircle
  } else if (isSuccess) {
    color = 'var(--green)'
    label = 'SUCCESS'
    Icon  = CheckCircle2
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: t.visible ? 1 : 0, y: t.visible ? 0 : 12, scale: t.visible ? 1 : 0.95 }}
      className="retro-window"
      style={{
        width: '100%',
        maxWidth: '320px',
        pointerEvents: 'auto',
        marginBottom: '8px',
      }}
    >
      <div className="retro-window-bar" style={{ background: color, padding: '3px 8px', height: 'auto' }}>
        <div className="retro-window-dots">
          <span style={{ background: 'rgba(255,255,255,0.4)', width: '8px', height: '8px' }} />
          <span style={{ background: 'rgba(255,255,255,0.2)', width: '8px', height: '8px' }} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700 }}>{label}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>

      <div style={{ padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ color }}>
          <Icon size={18} />
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.4, color: 'var(--dark)' }}>
          {resolveValue(t.message, t)}
        </div>
      </div>
    </motion.div>
  )
}
