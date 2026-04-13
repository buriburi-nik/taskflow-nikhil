import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Folder, Clock, CheckCircle2, FolderX, FolderPlus, LayoutDashboard, Search, List, Activity } from 'lucide-react'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { SkeletonCard } from '../components/Loader.jsx'


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
          className="cmd-overlay"
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="retro-window"
            style={{ width: '100%', maxWidth: '420px' }}
          >
            <div className="retro-window-bar">
              <div className="retro-window-dots">
                <span style={{ background: '#ff6b6b' }} />
                <span style={{ background: '#ffd93d' }} />
                <span style={{ background: '#6bcb77' }} />
              </div>
              NEW PROJECT — TASKFLOW
              <button
                onClick={onClose}
                style={{ marginLeft: 'auto', background: 'var(--pink)', border: '1px solid rgba(255,255,255,0.5)', color: 'white', width: '18px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="retro-label">Project name *</label>
                  <input
                    autoFocus
                    placeholder="e.g. WEBSITE REDESIGN"
                    className={`retro-input ${errors.name ? 'error' : ''}`}
                    {...register('name', { required: 'Project name required' })}
                  />
                  {errors.name && <p style={{ fontSize: '11px', color: 'var(--pink)', marginTop: '3px', fontWeight: 700 }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="retro-label">Description</label>
                  <textarea
                    rows={3}
                    placeholder="What is this project about?"
                    className="retro-input"
                    style={{ resize: 'vertical' }}
                    {...register('description')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button type="button" onClick={onClose} className="btn-retro-ghost" style={{ flex: 1 }}>[ CANCEL ]</button>
                  <button type="submit" disabled={isSubmitting} className="btn-retro btn-retro-green" style={{ flex: 1 }}>
                    {isSubmitting ? '...' : '[ CREATE ]'}
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
      <div style={{ color: 'var(--gray)', marginBottom: '12px' }}>
        <FolderX size={80} strokeWidth={1} />
      </div>
      <h3 style={{ fontFamily: 'VT323', fontSize: '32px', color: 'var(--dark)', letterSpacing: '0.05em', margin: '0 0 8px' }}>
        NO PROJECTS FOUND
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--dark)', opacity: 0.6, marginBottom: '20px' }}>
        Create your first project to get started.
      </p>
      <button onClick={onCreate} className="btn-retro btn-retro-green" style={{ fontSize: '14px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FolderPlus size={16} /> NEW PROJECT
      </button>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuthStore()
  const { projects, fetchProjects, createProject, deleteProject, isLoadingProjects } = useProjectStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (user?.id) fetchProjects(user.id)
  }, [user?.id, fetchProjects])

  async function handleCreate(name, description) {
    return createProject(name, description, user?.id)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project and all its tasks?')) return
    const r = await deleteProject(id)
    if (r.success) toast.success('Project deleted')
  }

  const allTasks = projects.flatMap(p => p.tasks || [])
  const inProgress = allTasks.filter(t => t.status === 'in_progress').length
  const completed = allTasks.filter(t => t.status === 'done').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', backgroundImage: 'radial-gradient(rgba(28,20,34,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
      {/* Menu bar */}
      <Navbar />

      {/* Toolbar */}
      <div className="retro-toolbar" style={{ marginTop: '28px' }}>
        <button onClick={() => setModalOpen(true)} className="retro-toolbar-btn">&#x2795; NEW PROJECT</button>
        <div style={{ width: '1px', height: '18px', background: 'var(--dark)', margin: '0 4px' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.05em', color: 'var(--dark)', opacity: 0.6, marginLeft: '4px' }}>
          {new Date().toDateString().toUpperCase()}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', letterSpacing: '0.05em' }}>
          CTRL+K — SEARCH
        </span>
      </div>

      <main style={{ padding: '20px 24px', paddingBottom: '40px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'VT323', fontSize: '52px', letterSpacing: '0.04em', lineHeight: 1, color: 'var(--dark)' }}>
              {user?.name?.toUpperCase() || 'WORKSPACE'}<span className="cursor-blink" />
            </h1>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--dark)', opacity: 0.6, marginTop: '4px' }}>
              &gt; {projects.length} PROJECT(S) · {allTasks.length} TASK(S) TOTAL
            </p>
          </div>

          <button onClick={() => setModalOpen(true)} className="btn-retro btn-retro-purple">
            &#x2795; NEW PROJECT
          </button>
        </div>

        {/* Stats row */}
        {projects.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'PROJECTS', value: projects.length, bg: 'var(--purple)', fg: 'white' },
              { label: 'TOTAL TASKS', value: allTasks.length, bg: 'var(--cream-dark)', fg: 'var(--dark)' },
              { label: 'IN PROGRESS', value: inProgress, bg: 'var(--yellow)', fg: 'var(--dark)' },
              { label: 'COMPLETED', value: completed, bg: 'var(--green)', fg: 'white' },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  border: '2px solid var(--dark)',
                  boxShadow: '3px 3px 0 var(--dark)',
                  background: s.bg,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontFamily: 'VT323', fontSize: '44px', color: s.fg, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: s.fg, opacity: 0.8, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Project grid or skeleton/empty */}
        <div style={{ borderBottom: '2px solid var(--dark)', marginBottom: '16px', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'VT323', fontSize: '22px', letterSpacing: '0.08em' }}>
            &#x25A0; PROJECTS ({projects.length})
          </span>
        </div>

        {isLoadingProjects ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Status bar */}
      <div className="retro-statusbar">
        <div className="retro-statusbar-segment">READY</div>
        <div className="retro-statusbar-segment">{projects.length} PROJECTS</div>
        <div className="retro-statusbar-segment">{allTasks.length} TASKS</div>
        <span style={{ marginLeft: 'auto', opacity: 0.6 }}>TASKFLOW v1.0 — NO SERVER REQUIRED</span>
      </div>

      <CreateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  )
}
