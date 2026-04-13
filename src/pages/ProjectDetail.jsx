import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, rectIntersection, useDroppable
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import toast from 'react-hot-toast'
import { 
  Plus, Home, Trash2, Filter, User, CheckCircle2, 
  AlertCircle, Layout 
} from 'lucide-react'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import TaskCard from '../components/TaskCard.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { SkeletonTaskCard } from '../components/Loader.jsx'
import RetroConfirmModal from '../components/RetroConfirmModal.jsx'

const COLS = [
  { id: 'todo',        label: 'TODO',        bg: 'var(--val-gray)' },
  { id: 'in_progress', label: 'IN PROGRESS', bg: 'var(--val-dark)' },
  { id: 'done',        label: 'DONE',        bg: 'var(--val-red)' },
]

function Column({ col, tasks, onEdit, onDelete, onAdd, loading }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })

  return (
    <div 
      ref={setNodeRef}
      style={{ 
        flex: 1,
        minWidth: 'min(85vw, 320px)',
        display: 'flex',
        flexDirection: 'column',
        background: isOver ? 'var(--val-bg-alt)' : 'transparent',
        transition: 'background 0.2s',
        minHeight: '600px',
        border: '2px solid var(--val-bg-alt)',
      }}
    >
      <div style={{ background: col.bg, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid var(--val-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Anton', fontSize: '24px', color: 'white', letterSpacing: '0.05em' }}>
             {col.label}
          </span>
          <span
            style={{
              fontFamily: 'Anton', fontSize: '18px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '2px 8px',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(col.id)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={`Add to ${col.label}`}
        >
          <Plus size={24} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <SkeletonTaskCard key={i} />)
        ) : tasks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, border: isOver ? '2px dashed var(--val-gray)' : 'none' }}>
            <AlertCircle size={40} color="var(--val-gray)" strokeWidth={1.5} />
            <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--val-gray)', marginTop: '8px', letterSpacing: '0.05em' }}>DROP TARGET</p>
          </div>
        ) : (
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence mode="popLayout">
              {tasks.map(t => (
                <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    currentProject, tasks, isLoadingProject,
    fetchProject, updateTask, deleteTask, setTasks, deleteProject,
  } = useProjectStore()

  const [modalOpen, setModalOpen]  = useState(false)
  const [editTask, setEditTask]    = useState(null)
  const [defStatus, setDefStatus]  = useState('todo')
  const [activeTask, setActiveTask] = useState(null)
  
  const [confirmTaskOpen, setConfirmTaskOpen] = useState(false)
  const [confirmProjOpen, setConfirmProjOpen] = useState(false)
  const [pendingTaskId, setPendingTaskId] = useState(null)
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  useEffect(() => { fetchProject(id) }, [id, fetchProject])

  const assignees = useMemo(() => {
    const names = new Set(tasks.map(t => t.assignee_name).filter(Boolean))
    return ['all', ...Array.from(names)]
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchAssignee = assigneeFilter === 'all' || t.assignee_name === assigneeFilter
      return matchStatus && matchAssignee
    })
  }, [tasks, statusFilter, assigneeFilter])

  function openAdd(status = 'todo') { setEditTask(null); setDefStatus(status); setModalOpen(true) }
  function openEdit(task)           { setEditTask(task); setModalOpen(true) }

  async function handleDelete(taskId) {
    setPendingTaskId(taskId)
    setConfirmTaskOpen(true)
  }

  async function confirmDeleteTask() {
    if (!pendingTaskId) return
    await deleteTask(pendingTaskId)
    setPendingTaskId(null)
    setConfirmTaskOpen(false)
  }

  async function handleDeleteProject() {
    setConfirmProjOpen(true)
  }

  async function confirmDeleteProject() {
    setConfirmProjOpen(false)
    const r = await deleteProject(id)
    if (r.success) { toast.success('Protocol terminated'); navigate('/') }
  }

  async function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id
    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    let overContainerId = null
    const droppedOnTask = tasks.find(t => t.id === overId)
    
    if (droppedOnTask) { overContainerId = droppedOnTask.status } 
    else { overContainerId = COLS.find(c => c.id === overId)?.id }

    if (!overContainerId) return

    if (overContainerId !== activeTask.status) {
      await updateTask(activeId, { status: overContainerId })
      return
    }

    if (activeId !== overId) {
      const oldIndex = tasks.findIndex(t => t.id === activeId)
      const newIndex = tasks.findIndex(t => t.id === overId)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
    }
  }

  const byStatus = (s) => filteredTasks.filter(t => t.status === s)
  const allDone  = tasks.length > 0 && tasks.every(t => t.status === 'done')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--val-bg)' }}>
      <Navbar projectName={currentProject?.name} />

      <div style={{ background: 'var(--val-light)', borderBottom: '2px solid var(--val-bg-alt)', padding: '12px clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--val-gray)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Anton', fontSize: '16px' }}>
          <Home size={16} /> DASHBOARD
        </Link>
        <div style={{ width: '2px', height: '16px', background: 'var(--val-bg-alt)' }} />
        <button onClick={() => openAdd()} style={{ background: 'transparent', border: 'none', color: 'var(--val-dark)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Anton', fontSize: '16px', cursor: 'pointer' }}>
          <Plus size={16} /> ADD TASK
        </button>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--val-bg)', padding: '6px 12px', border: '2px solid var(--val-bg-alt)' }}>
            <Filter size={14} color="var(--val-gray)" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ background: 'none', border: 'none', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '14px', outline: 'none', color: 'var(--val-dark)' }}
            >
              <option value="all">ALL STATUS</option>
              <option value="todo">TODO</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--val-bg)', padding: '6px 12px', border: '2px solid var(--val-bg-alt)' }}>
            <User size={14} color="var(--val-gray)" />
            <select 
              value={assigneeFilter} 
              onChange={e => setAssigneeFilter(e.target.value)}
              style={{ background: 'none', border: 'none', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '14px', outline: 'none', color: 'var(--val-dark)', textTransform: 'uppercase' }}
            >
              <option value="all">ALL ASSIGNEES</option>
              {assignees.filter(a => a !== 'all').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <button onClick={handleDeleteProject} style={{ color: 'var(--val-red)', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Anton', fontSize: '16px', cursor: 'pointer' }}>
            <Trash2 size={16} /> TERMINATE PROTOCOL
          </button>
        </div>
      </div>

      <main style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {isLoadingProject ? (
            <div style={{ height: '48px', width: '280px', background: 'var(--val-bg-alt)' }} />
          ) : (
            <div>
              <h1 style={{ fontFamily: 'Anton', fontSize: 'clamp(36px, 8vw, 64px)', letterSpacing: '0.02em', lineHeight: 1, color: 'var(--val-dark)', display: 'flex', alignItems: 'center', gap: '16px', margin: 0, flexWrap: 'wrap' }}>
                {currentProject?.name?.toUpperCase() || '...'}
              </h1>
              {currentProject?.description && (
                <p style={{ fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 600, color: 'var(--val-gray)', marginTop: '8px', maxWidth: '600px' }}>
                  {currentProject.description}
                </p>
              )}
            </div>
          )}

          {allDone && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: 'var(--val-red)', color: 'white', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
              <CheckCircle2 size={28} color="white" />
              <span style={{ fontFamily: 'Anton', fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: '0.05em' }}>MISSION ACCOMPLISHED</span>
            </motion.div>
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={({ active }) => setActiveTask(tasks.find(t => t.id === active.id) || null)}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '40px', alignItems: 'flex-start' }}
          >
            {COLS.map(col => (
              <Column
                key={col.id}
                col={col}
                tasks={byStatus(col.id)}
                onEdit={openEdit}
                onDelete={handleDelete}
                onAdd={openAdd}
                loading={isLoadingProject}
              />
            ))}
          </motion.div>

          <DragOverlay>
            {activeTask && (
              <div style={{ opacity: 0.9 }}>
                <TaskCard task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        task={editTask}
        projectId={id}
        defaultStatus={defStatus}
      />

      <RetroConfirmModal
        isOpen={confirmTaskOpen}
        onClose={() => { setConfirmTaskOpen(false); setPendingTaskId(null) }}
        onConfirm={confirmDeleteTask}
        title="DELETE TASK?"
        message="ARE YOU SURE YOU WANT TO TERMINATE THIS TASK? THIS ACTION CANNOT BE UNDONE."
      />

      <RetroConfirmModal
        isOpen={confirmProjOpen}
        onClose={() => setConfirmProjOpen(false)}
        onConfirm={confirmDeleteProject}
        title="TERMINATE ENTIRE PROTOCOL?"
        message="ARE YOU SURE YOU WANT TO DESTROY THIS OVERALL PROJECT AND ALL ATTACHED TASKS? THIS DATA WILL BE PURGED."
      />
    </div>
  )
}
