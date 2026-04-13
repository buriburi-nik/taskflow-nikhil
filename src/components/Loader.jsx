export function SkeletonCard() {
  return (
    <div className="retro-card" style={{ padding: '0' }}>
      <div className="skeleton" style={{ height: '28px', borderBottom: '2px solid var(--dark)' }} />
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '18px', width: '70%' }} />
        <div className="skeleton" style={{ height: '12px', width: '50%' }} />
        <div className="skeleton" style={{ height: '8px', width: '100%' }} />
        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
      </div>
    </div>
  )
}

export function SkeletonTaskCard() {
  return (
    <div style={{ border: '2px solid var(--dark)', background: 'var(--white)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="skeleton" style={{ height: '16px', width: '50%' }} />
      <div className="skeleton" style={{ height: '14px', width: '80%' }} />
      <div className="skeleton" style={{ height: '10px', width: '35%' }} />
    </div>
  )
}

export default function Loader({ message = 'LOADING...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px 20px' }}>
      <div style={{ fontFamily: 'VT323', fontSize: '32px', color: 'var(--purple)', letterSpacing: '0.2em' }}>
        &#x25A0;&#x25A1;&#x25A0;&#x25A1;&#x25A0;
      </div>
      <p style={{ fontFamily: 'Space Mono', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--dark)' }}>{message}</p>
    </div>
  )
}
