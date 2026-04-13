import { Sun, Moon } from 'lucide-react'
import useUiStore from '../store/uiStore.js'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUiStore()

  return (
    <button
      onClick={toggleTheme}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        background: 'transparent',
        border: 'none',
        color: 'var(--val-gray)',
        fontFamily: 'Anton',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '8px 16px',
        transition: 'color 0.2s',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--val-red)'; e.currentTarget.style.background = 'var(--val-dark)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--val-gray)'; e.currentTarget.style.background = 'transparent'; }}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      <span style={{ paddingTop: '2px', letterSpacing: '0.05em' }}>
        {theme === 'light' ? 'DARK' : 'LIGHT'}
      </span>
    </button>
  )
}
