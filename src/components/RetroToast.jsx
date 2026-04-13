import toast, { resolveValue } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export default function RetroToast({ t }) {
  const isError   = t.type === 'error'
  const isSuccess = t.type === 'success'
  
  let color = 'var(--val-dark)'
  let label = 'SYSTEM MESSAGE'
  let Icon  = Info

  if (isError) {
    color = 'var(--val-red)'
    label = 'ERROR DETECTED'
    Icon  = AlertCircle
  } else if (isSuccess) {
    color = 'var(--val-gray)'
    label = 'PROTOCOL SUCCESS' // success tone
    Icon  = CheckCircle2
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: t.visible ? 1 : 0, x: t.visible ? 0 : 40 }}
      className="val-card"
      style={{
        width: '100%',
        maxWidth: '360px',
        pointerEvents: 'auto',
        marginBottom: '12px',
        padding: 0,
        border: 'none',
        boxShadow: `4px 4px 0 ${color}`
      }}
    >
      <div style={{ background: color, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Anton', fontSize: '14px', color: 'white', letterSpacing: '0.05em' }}>{label}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>

      <div style={{ background: 'var(--val-light)', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', borderLeft: `4px solid ${color}`, borderRight: `2px solid var(--val-dark)`, borderBottom: `2px solid var(--val-dark)` }}>
        <div style={{ color, marginTop: '2px' }}>
          <Icon size={20} />
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, lineHeight: 1.4, color: 'var(--val-dark)' }}>
          {resolveValue(t.message, t)}
        </div>
      </div>
    </motion.div>
  )
}
