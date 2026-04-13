import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'

export default function CommandPalette() {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { projects } = useProjectStore()
  const { logout } = useAuthStore()

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
        setCursor(0)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
  }, [open])

  const commands = [
    { id: 'home',   label: 'GO TO DASHBOARD', icon: '▶', run: () => navigate('/') },
    { id: 'logout', label: 'SIGN OUT',         icon: '⊗', run: () => { logout(); navigate('/login') } },
    ...projects.map(p => ({
      id:    `proj-${p.id}`,
      label: p.name.toUpperCase(),
      icon:  '□',
      group: 'PROJECTS',
      run:   () => navigate(`/projects/${p.id}`),
    })),
  ]

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === 'Enter' && filtered[cursor]) { filtered[cursor].run(); setOpen(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="cmd-overlay"
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -16, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -16, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            onClick={e => e.stopPropagation()}
            className="retro-window"
            style={{ width: '100%', maxWidth: '480px' }}
          >
            {/* Title */}
            <div className="retro-window-bar">
              <div className="retro-window-dots">
                <span style={{ background: '#ff6b6b' }} />
                <span style={{ background: '#ffd93d' }} />
                <span style={{ background: '#6bcb77' }} />
              </div>
              COMMAND PALETTE — CTRL+K
            </div>

            {/* Search input */}
            <div style={{ padding: '10px', borderBottom: '2px solid var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'VT323', fontSize: '20px', color: 'var(--purple)' }}>&#x25B7;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0) }}
                onKeyDown={onKeyDown}
                placeholder="TYPE A COMMAND OR PROJECT NAME..."
                className="retro-input"
                style={{ border: 'none', background: 'transparent', padding: '2px 0', fontSize: '13px' }}
              />
              <span className="retro-kbd">ESC</span>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <p style={{ padding: '24px', textAlign: 'center', fontSize: '12px', letterSpacing: '0.08em', opacity: 0.5 }}>
                  NO RESULTS FOR "{query}"
                </p>
              ) : filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.run(); setOpen(false) }}
                  onMouseEnter={() => setCursor(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: i === cursor ? 'var(--purple)' : 'transparent',
                    color: i === cursor ? 'white' : 'var(--dark)',
                    borderBottom: '1px solid var(--gray)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textAlign: 'left',
                    transition: 'background 0.05s',
                  }}
                >
                  <span style={{ fontFamily: 'VT323', fontSize: '18px' }}>{cmd.icon}</span>
                  {cmd.label}
                  {i === cursor && <span style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.7 }}>ENTER ↵</span>}
                </button>
              ))}
            </div>

            {/* Footer hints */}
            <div style={{ padding: '6px 12px', borderTop: '2px solid var(--dark)', background: 'var(--cream-dark)', display: 'flex', gap: '14px', fontSize: '11px', letterSpacing: '0.06em', opacity: 0.7 }}>
              <span>↑↓ NAVIGATE</span>
              <span>↵ SELECT</span>
              <span>ESC CLOSE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
