import { Sun, Moon } from 'lucide-react'
import useUiStore from '../store/uiStore.js'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUiStore()

  return (
    <button
      onClick={toggleTheme}
      className="retro-menubar-item"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'transparent',
        borderRight: 'none'
      }}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
      <span style={{ fontSize: '10px' }}>
        {theme === 'light' ? 'DARK' : 'LIGHT'}
      </span>
    </button>
  )
}
