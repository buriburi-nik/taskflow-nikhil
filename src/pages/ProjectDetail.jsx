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
  AlertCircle, Clock, Layout, ChevronDown, ListFilter 
} from 'lucide-react'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import TaskCard from '../components/TaskCard.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { SkeletonTaskCard } from '../components/Loader.jsx'
import RetroConfirmModal from '../components/RetroConfirmModal.jsx'

const COLS = [
  { id: 'todo',        label: 'TODO',        bg: 'var(--cream-dark)',  fg: 'var(--dark)' },
  { id: 'in_progress', label: 'IN PROGRESS',  bg: 'var(--yellow)',     fg: 'var(--dark)' },
  { id: 'done',        label: 'DONE',         bg: 'var(--green)',      fg: 'white'       },
]

function Column({ col, tasks, onEdit, onDelete, onAdd, loading }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })

  return (
    <div 
      ref={setNodeRef}
      className={`retro-col ${isOver ? 'over' : ''}`}
      style={{ 
        background: isOver ? 'rgba(28,20,34,0.05)' : 'transparent',
        transition: 'background 0.2s'
      }}
    >
      {/* Column header */}
      <div className="retro-col-header" style={{ background: col.bg, borderBottom: '2px solid var(--dark)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'VT323', fontSize: '20px', color: col.fg, letterSpacing: '0.06em' }}>
            &#x25A0; {col.label}
          </span>
          <span
            style={{
              fontFamily: 'Space Mono', fontSize: '11px', fontWeight: 700,
              background: 'rgba(28,20,34,0.15)',
              color: col.fg,
              padding: '1px 7px',
              border: '1px solid rgba(28,20,34,0.3)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(col.id)}
          className="btn-retro-icon"
          style={{ width: '22px', height: '20px', color: col.fg }}
          title={`Add to ${col.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', minHeight: '100px' }}>
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <SkeletonTaskCard key={i} />)
        ) : tasks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '30px 10px', border: isOver ? '2px dashed var(--gray)' : 'none' }}>
            <AlertCircle size={32} color="var(--gray)" strokeWidth={1} />
            <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '8px', letterSpacing: '0.08em', textAlign: 'center' }}>EMPTY — DROP HERE</p>
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
  
  // Confirmation states
  const [confirmTaskOpen, setConfirmTaskOpen] = useState(false)
  const [confirmProjOpen, setConfirmProjOpen] = useState(false)
  const [pendingTaskId, setPendingTaskId] = useState(null)
  
  // Filtering state
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
    if (r.success) { toast.success('Project deleted'); navigate('/') }
  }

  async function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Find destination container
    let overContainerId = null
    const droppedOnTask = tasks.find(t => t.id === overId)
    
    if (droppedOnTask) {
      overContainerId = droppedOnTask.status
    } else {
      // It might be the column ID itself
      overContainerId = COLS.find(c => c.id === overId)?.id
    }

    if (!overContainerId) return

    // If container changed
    if (overContainerId !== activeTask.status) {
      await updateTask(activeId, { status: overContainerId })
      return
    }

    // If sorting within same container
    if (activeId !== overId) {
      const oldIndex = tasks.findIndex(t => t.id === activeId)
      const newIndex = tasks.findIndex(t => t.id === overId)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
    }
  }

  const byStatus = (s) => filteredTasks.filter(t => t.status === s)
  const allDone  = tasks.length > 0 && tasks.every(t => t.status === 'done')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', backgroundImage: 'radial-gradient(rgba(28,20,34,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
      <Navbar projectName={currentProject?.name} />

      {/* Toolbar */}
      <div className="retro-toolbar" style={{ marginTop: '28px' }}>
        <Link to="/" className="retro-toolbar-btn">
          <Home size={14} /> DASHBOARD
        </Link>
        <div style={{ width: '1px', height: '18px', background: 'var(--dark)', margin: '0 4px' }} />
        <button onClick={() => openAdd()} className="retro-toolbar-btn">
          <Plus size={14} /> ADD TASK
        </button>
        
        {/* Filter dropdowns */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'var(--cream-dark)', padding: '2px 8px', border: '1px solid var(--dark)' }}>
            <Filter size={12} />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: 700, outline: 'none' }}
            >
              <option value="all">ALL STATUS</option>
              <option value="todo">TODO</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'var(--cream-dark)', padding: '2px 8px', border: '1px solid var(--dark)' }}>
            <User size={12} />
            <select 
              value={assigneeFilter} 
              onChange={e => setAssigneeFilter(e.target.value)}
              style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: 700, outline: 'none', textTransform: 'uppercase' }}
            >
              <option value="all">ALL ASSIGNEES</option>
              {assignees.filter(a => a !== 'all').map(a => (
                <option key={a} value={a}>{a.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button onClick={handleDeleteProject} className="retro-toolbar-btn" style={{ color: 'var(--pink)', fontWeight: 700 }}>
            <Trash2 size={14} /> DELETE
          </button>
        </div>
      </div>

      <main style={{ padding: '20px 20px 50px' }}>
        {/* Project heading */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isLoadingProject ? (
            <div className="skeleton" style={{ height: '48px', width: '280px' }} />
          ) : (
            <div>
              <h1 style={{ fontFamily: 'VT323', fontSize: '48px', letterSpacing: '0.04em', lineHeight: 1, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Layout size={32} /> {currentProject?.name?.toUpperCase() || '...'}
              </h1>
              {currentProject?.description && (
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--dark)', opacity: 0.7, marginTop: '8px', maxWidth: '600px' }}>
                  &gt; {currentProject.description}
                </p>
              )}
            </div>
          )}

          {allDone && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--green)', border: '2px solid var(--dark)', boxShadow: '3px 3px 0 var(--dark)' }}
            >
              <CheckCircle2 size={24} color="white" />
              <span style={{ fontFamily: 'VT323', fontSize: '24px', color: 'white' }}>PROJECT COMPLETE</span>
            </motion.div>
          )}
        </div>

        {/* Kanban */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={({ active }) => setActiveTask(tasks.find(t => t.id === active.id) || null)}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', alignItems: 'flex-start' }}
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
              <div style={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
                <TaskCard task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Status bar */}
      <div className="retro-statusbar">
        <div className="retro-statusbar-segment">
          <Clock size={12} /> {isLoadingProject ? 'SYNCING...' : 'ONLINE'}
        </div>
        <div className="retro-statusbar-segment">
           {filteredTasks.length} {filteredTasks.length === 1 ? 'TASK' : 'TASKS'} SHOWN
        </div>
        <div className="retro-statusbar-segment">
          <CheckCircle2 size={12} /> {tasks.filter(t => t.status === 'done').length}/{tasks.length} COMPLETE
        </div>
        <span style={{ marginLeft: 'auto', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layout size={12} /> TASKFLOW v1.0.4
        </span>
      </div>

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
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />

      <RetroConfirmModal
        isOpen={confirmProjOpen}
        onClose={() => setConfirmProjOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Entire Project?"
        message="Are you sure you want to delete this entire project and all its tasks? This action cannot be undone."
      />
    </div>
  )
}

