import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Terminal, Home, LogOut, User, ChevronDown, ChevronUp, Layout
} from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar({ projectName }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="val-navbar">
      {/* Logo */}
      <Link to="/" className="val-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: 0, color: 'var(--val-red)' }}>
        <Terminal size={28} /> <span style={{ paddingTop: '4px' }}>TASKFLOW</span>
      </Link>

      {projectName && (
        <span
          className="val-nav-item hidden-mobile"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '2px solid var(--val-gray)' }}
        >
          <Layout size={20} /> <span style={{ paddingTop: '4px' }}>{projectName.toUpperCase()}</span>
        </span>
      )}

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      <ThemeToggle />

      {/* User */}
      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setUserMenuOpen(o => !o)}
          className="val-nav-item"
          style={{ gap: '12px', display: 'flex', alignItems: 'center', border: 'none', background: 'transparent', cursor: 'pointer', paddingRight: 0 }}
        >
          <div style={{ width: '32px', height: '32px', background: 'var(--val-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
            <User size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '18px', paddingTop: '2px' }} className="hidden-mobile">
            {user?.name?.toUpperCase() || 'OPERATIVE'}
          </span>
          {userMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                minWidth: '240px',
                background: 'var(--val-light)',
                border: '2px solid var(--val-dark)',
                zIndex: 200,
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
              }}
            >
              <div style={{ padding: '16px', borderBottom: '2px solid var(--val-bg)', fontFamily: 'Rajdhani', fontSize: '14px', color: 'var(--val-gray)', fontWeight: 600 }}>
                ID: {user?.email}
              </div>
              <Link
                to="/"
                onClick={() => setUserMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', fontSize: '16px', fontFamily: 'Anton', color: 'var(--val-dark)', textDecoration: 'none', transition: 'background 0.2s, color 0.2s', letterSpacing: '0.05em' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--val-dark)'; e.currentTarget.style.color = 'var(--val-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--val-dark)'; }}
              >
                <Home size={18} /> COMMAND CENTER
              </Link>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', fontSize: '16px', fontFamily: 'Anton', color: 'var(--val-red)', width: '100%', background: 'transparent', border: 'none', borderTop: '2px solid var(--val-bg)', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s, color 0.2s', letterSpacing: '0.05em' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--val-red)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--val-red)'; }}
              >
                <LogOut size={18} /> DISCONNECT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
