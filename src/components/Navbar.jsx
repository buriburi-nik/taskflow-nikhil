import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Terminal, Home, LogOut, User, ChevronDown, ChevronUp, Layout, Menu
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
    <div className="retro-menubar">
      {/* Logo */}
      <Link to="/" className="retro-menubar-item" style={{ fontFamily: 'VT323', fontSize: '18px', letterSpacing: '0.1em', borderRight: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Terminal size={18} /> TASKFLOW
      </Link>



      {projectName && (
        <span
          className="retro-menubar-item"
          style={{ color: 'var(--yellow)', borderLeft: '1px solid rgba(255,255,255,0.2)', fontFamily: 'VT323', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          / <Layout size={14} /> <span className="hidden-mobile">{projectName.toUpperCase()}</span>
        </span>
      )}

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      <ThemeToggle />

      {/* User */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setUserMenuOpen(o => !o)}
          className="retro-menubar-item"
          style={{ gap: '8px', display: 'flex', alignItems: 'center', borderRight: 'none' }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '2px', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Mono', fontWeight: 700 }} className="hidden-mobile">
            {user?.name?.toUpperCase() || 'USER'}
          </span>
          {userMenuOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                minWidth: '200px',
                background: 'var(--white)',
                border: '2px solid var(--dark)',
                boxShadow: '4px 4px 0 var(--dark)',
                zIndex: 200,
              }}
            >
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--dark)', fontSize: '10px', color: 'var(--purple)', fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(28,20,34,0.03)' }}>
                LOGIN: {user?.email}
              </div>
              <Link
                to="/"
                onClick={() => setUserMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--dark)', textTransform: 'uppercase', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--yellow)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Home size={14} /> DASHBOARD
              </Link>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--pink)', textTransform: 'uppercase', width: '100%', background: 'transparent', border: 'none', borderTop: '1px solid var(--dark)', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,71,158,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={14} /> SIGN OUT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
