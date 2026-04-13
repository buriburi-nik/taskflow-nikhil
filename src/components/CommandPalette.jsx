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
    { id: 'home',   label: 'COMMAND CENTER', icon: '▶', run: () => navigate('/') },
    { id: 'logout', label: 'DISCONNECT',      icon: '⊗', run: () => { logout(); navigate('/login') } },
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
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -20, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="val-card"
            style={{ width: '100%', maxWidth: '600px', padding: 0 }}
          >
            <div style={{ background: 'var(--val-red)', padding: '12px 20px', color: 'white', fontFamily: 'Anton', fontSize: '20px', letterSpacing: '0.05em' }}>
              COMMAND INTERFACE <span style={{ opacity: 0.7, fontSize: '14px', marginLeft: '8px' }}>CTRL+K</span>
            </div>

            <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--val-bg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'Anton', fontSize: '24px', color: 'var(--val-red)' }}>&#x25B7;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0) }}
                onKeyDown={onKeyDown}
                placeholder="ENTER DIRECTIVE OR SYSTEM NAME..."
                className="val-input"
                style={{ border: 'none', background: 'transparent', padding: '0', fontSize: '18px', clipPath: 'none' }}
              />
              <span className="val-key" style={{ marginLeft: 'auto' }}>ESC</span>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
              {filtered.length === 0 ? (
                <p style={{ padding: '32px', textAlign: 'center', fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--val-gray)', letterSpacing: '0.05em' }}>
                  NO DIRECTIVES DETECTED FOR "{query}"
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
                    gap: '12px',
                    padding: '12px 16px',
                    background: i === cursor ? 'var(--val-dark)' : 'transparent',
                    color: i === cursor ? 'white' : 'var(--val-dark)',
                    border: 'none',
                    fontFamily: 'Anton',
                    fontSize: '18px',
                    letterSpacing: '0.05em',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                >
                  <span style={{ fontSize: '20px', width: '24px', textAlign: 'center', color: i === cursor ? 'var(--val-red)' : 'var(--val-gray)' }}>{cmd.icon}</span>
                  {cmd.label}
                  {i === cursor && <span style={{ marginLeft: 'auto', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, padding: '2px 6px', background: 'var(--val-red)', color: 'white' }}>ENTER ↵</span>}
                </button>
              ))}
            </div>
            
            <div style={{ background: 'var(--val-bg)', padding: '8px 16px', borderTop: '2px solid var(--val-bg-alt)', display: 'flex', gap: '16px', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: 'var(--val-gray)' }}>
              <span>↑↓ NAVIGATE</span>
              <span>↵ EXECUTE</span>
              <span>ESC ABORT</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
