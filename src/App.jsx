import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import useAuthStore from './store/authStore.js'
import useUiStore from './store/uiStore.js'

export default function App() {
  const init = useAuthStore(s => s.init)
  const theme = useUiStore(s => s.theme)

  useEffect(() => { init() }, [init])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>

      <div className="crt-scanlines" aria-hidden="true" />

      <CommandPalette />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1422',
            color: '#f5efcb',
            border: '2px solid #1c1422',
            borderRadius: '0',
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.05em',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
          },
          success: { iconTheme: { primary: '#7fc241', secondary: '#f5efcb' } },
          error: { iconTheme: { primary: '#e8479e', secondary: '#f5efcb' } },
          duration: 2800,
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute><ProjectDetail /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
