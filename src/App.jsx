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
import RetroToast from './components/RetroToast.jsx'

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
      <CommandPalette />

      <Toaster position="top-right" gutter={8}>
        {(t) => <RetroToast t={t} />}
      </Toaster>

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
