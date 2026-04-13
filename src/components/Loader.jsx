export function SkeletonCard() {
  return (
    <div className="val-card" style={{ padding: '0' }}>
      <div style={{ height: '4px', width: '40px', background: 'var(--val-gray)', opacity: 0.2 }} />
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ height: '24px', width: '70%', background: 'var(--val-gray)', opacity: 0.1 }} />
        <div style={{ height: '16px', width: '50%', background: 'var(--val-gray)', opacity: 0.1 }} />
        <div style={{ height: '12px', width: '100%', background: 'var(--val-gray)', opacity: 0.1 }} />
        <div style={{ height: '16px', width: '40%', background: 'var(--val-gray)', opacity: 0.1 }} />
      </div>
    </div>
  )
}

export function SkeletonTaskCard() {
  return (
    <div className="val-card" style={{ padding: '16px' }}>
      <div style={{ height: '20px', width: '50%', background: 'var(--val-gray)', opacity: 0.1, marginBottom: '12px' }} />
      <div style={{ height: '14px', width: '80%', background: 'var(--val-gray)', opacity: 0.1, marginBottom: '8px' }} />
      <div style={{ height: '14px', width: '35%', background: 'var(--val-gray)', opacity: 0.1 }} />
    </div>
  )
}

export default function Loader({ message = 'INITIALIZING PROTOCOL...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '80px 20px', minHeight: '100vh', background: 'var(--val-bg)' }}>
      {/* Simulated Valorant angular spinning logo substitute */}
      <div style={{ 
        width: '60px', height: '60px', 
        border: '4px solid var(--val-red)', 
        borderRightColor: 'transparent',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        animation: 'spin 1s linear infinite' 
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      <p style={{ fontFamily: 'Anton', fontSize: '24px', letterSpacing: '0.1em', color: 'var(--val-dark)' }}>{message}</p>
    </div>
  )
}
