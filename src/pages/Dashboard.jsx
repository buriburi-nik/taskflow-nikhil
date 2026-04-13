import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Folder, Clock, CheckCircle2, FolderX, FolderPlus, LayoutDashboard, Search, List, Activity, Home, Menu } from 'lucide-react'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { SkeletonCard } from '../components/Loader.jsx'
import RetroConfirmModal from '../components/RetroConfirmModal.jsx'


function CreateModal({ isOpen, onClose, onCreate }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    if (!isOpen) return
    const close = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [isOpen, onClose])

  async function onSubmit({ name, description }) {
    const r = await onCreate(name, description)
    if (r.success) { toast.success('Project created'); reset(); onClose() }
    else toast.error(r.error)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="val-card"
            style={{ width: '100%', maxWidth: '420px', padding: 0 }}
          >
            <div style={{ background: 'var(--val-dark)', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Anton', fontSize: '24px', letterSpacing: '0.05em' }}>INITIATE PROJECT</span>
              <button
                onClick={onClose}
                style={{ background: 'var(--val-red)', border: 'none', color: 'white', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="val-label">PROJECT NAME</label>
                  <input
                    autoFocus
                    placeholder="E.G. REDESIGN PROTOCOL"
                    className={`val-input ${errors.name ? 'error' : ''}`}
                    {...register('name', { required: 'REQUIRED' })}
                  />
                  {errors.name && <p style={{ fontSize: '14px', color: 'var(--val-red)', marginTop: '6px', fontWeight: 700 }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="val-label">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    placeholder="DEFINE OBJECTIVES"
                    className="val-input"
                    style={{ resize: 'vertical' }}
                    {...register('description')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button type="button" onClick={onClose} className="val-btn secondary" style={{ flex: 1, fontSize: '16px' }}>CANCEL</button>
                  <button type="submit" disabled={isSubmitting} className="val-btn" style={{ flex: 1, fontSize: '16px' }}>
                    {isSubmitting ? '...' : 'CREATE'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────

function EmptyState({ onCreate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
      <div style={{ color: 'var(--val-gray)', marginBottom: '16px' }}>
        <FolderX size={80} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontFamily: 'Anton', fontSize: '40px', color: 'var(--val-dark)', letterSpacing: '0.05em', margin: '0 0 8px' }}>
        NO PROJECTS DETECTED
      </h3>
      <p style={{ fontSize: '18px', color: 'var(--val-gray)', marginBottom: '32px', fontFamily: 'Rajdhani', fontWeight: 600 }}>
        INITIALIZE A NEW PROJECT TO BEGIN.
      </p>
      <button onClick={onCreate} className="val-btn">
        <FolderPlus size={20} /> NEW PROJECT
      </button>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuthStore()
  const { projects, fetchProjects, createProject, deleteProject, isLoadingProjects } = useProjectStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  useEffect(() => {
    if (user?.id) fetchProjects(user.id)
  }, [user?.id, fetchProjects])

  async function handleCreate(name, description) {
    return createProject(name, description, user?.id)
  }

  async function handleDelete(id) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    const id = pendingDeleteId
    setPendingDeleteId(null)
    setConfirmOpen(false)
    
    const r = await deleteProject(id)
    if (r.success) toast.success('Project deleted')
  }

  const allTasks = projects.flatMap(p => p.tasks || [])
  const inProgress = allTasks.filter(t => t.status === 'in_progress').length
  const completed = allTasks.filter(t => t.status === 'done').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--val-bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Subtle Cinematic Background Watermark */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '120%', opacity: 0.05, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <img src="/agent-bg.png" alt="Agent BG" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) blur(4px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--val-bg), transparent)' }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        <main style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Page title */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'Anton', fontSize: 'clamp(36px, 8vw, 64px)', letterSpacing: '0.02em', lineHeight: 1, color: 'var(--val-dark)', margin: 0 }}>
              {user?.name?.toUpperCase() || 'WORKSPACE'}
            </h1>
            <p style={{ fontSize: '18px', fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--val-red)', letterSpacing: '0.1em', marginTop: '8px', margin: 0 }}>
              // {projects.length} PROJECTS · {allTasks.length} TASKS TOTAL
            </p>
          </div>

          <button onClick={() => setModalOpen(true)} className="val-btn">
            <FolderPlus size={20} /> NEW PROJECT
          </button>
        </div>

        {/* Stats row */}
        {projects.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'PROJECTS', value: projects.length, bg: 'var(--val-dark)', fg: 'white' },
              { label: 'TOTAL TASKS', value: allTasks.length, bg: 'var(--val-bg-alt)', fg: 'var(--val-dark)' },
              { label: 'IN PROGRESS', value: inProgress, bg: 'var(--val-gray)', fg: 'white' },
              { label: 'COMPLETED', value: completed, bg: 'var(--val-red)', fg: 'white' },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  padding: '24px',
                  border: '2px solid var(--val-dark)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  position: 'relative'
                }}
              >
                <div style={{ fontFamily: 'Anton', fontSize: 'clamp(32px, 5vw, 48px)', color: s.fg, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, letterSpacing: '0.12em', color: s.fg, opacity: 0.9, marginTop: '8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Project grid or skeleton/empty */}
        <div style={{ borderBottom: '2px solid var(--val-dark)', marginBottom: '24px', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Anton', fontSize: 'clamp(20px, 4vw, 28px)', letterSpacing: '0.05em', color: 'var(--val-dark)' }}>
            PROJECT DIRECTORY
          </span>
        </div>

        {isLoadingProjects ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
             {/* We will update ProjectCard child shortly. It will just render whatever it is. */}
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <CreateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      
        <RetroConfirmModal
          isOpen={confirmOpen}
          onClose={() => { setConfirmOpen(false); setPendingDeleteId(null) }}
          onConfirm={confirmDelete}
          title="Delete Project?"
          message="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
        />
      </div>
    </div>
  )
}
