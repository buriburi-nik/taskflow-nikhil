import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  X, Edit3, Plus, Type, AlignLeft, 
  Activity, Flag, Calendar 
} from 'lucide-react'
import useProjectStore from '../store/projectStore.js'
import useAuthStore from '../store/authStore.js'

export default function TaskModal({ isOpen, onClose, task, projectId, defaultStatus = 'todo' }) {
  const { createTask, updateTask } = useProjectStore()
  const { user } = useAuthStore()
  const editing = Boolean(task)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', description: '', status: defaultStatus, priority: 'medium', due_date: '' },
  })

  useEffect(() => {
    if (task) {
      reset({
        title:       task.title || '',
        description: task.description || '',
        status:      task.status || 'todo',
        priority:    task.priority || 'medium',
        due_date:    task.due_date?.split('T')[0] || '',
      })
    } else {
      reset({ title: '', description: '', status: defaultStatus, priority: 'medium', due_date: '' })
    }
  }, [task, defaultStatus, reset, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const close = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [isOpen, onClose])

  async function onSubmit(values) {
    const r = editing
      ? await updateTask(task.id, values)
      : await createTask(projectId, values, user?.id, user?.name)

    if (r.success) {
      toast.success(editing ? 'Task updated' : 'Task created')
      onClose()
    } else {
      toast.error(r.error || 'Something went wrong')
    }
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
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="retro-window"
            style={{ width: '100%', maxWidth: '460px' }}
          >
            <div className="retro-window-bar">
              <div className="retro-window-dots">
                <span style={{ background: '#ff6b6b' }} />
                <span style={{ background: '#ffd93d' }} />
                <span style={{ background: '#6bcb77' }} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {editing ? <Edit3 size={14} /> : <Plus size={14} />}
                {editing ? 'EDIT TASK' : 'NEW TASK'} — TASKFLOW
              </span>
              <button
                onClick={onClose}
                className="btn-retro-icon"
                style={{ marginLeft: 'auto', background: 'var(--pink)', color: 'white', width: '20px', height: '18px' }}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="retro-label"><Type size={12} /> Task title *</label>
                <input
                  autoFocus
                  placeholder="What needs to be done?"
                  className={`retro-input ${errors.title ? 'error' : ''}`}
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p style={{ fontSize: '11px', color: 'var(--pink)', marginTop: '3px', fontWeight: 700 }}>{errors.title.message}</p>}
              </div>

              <div>
                <label className="retro-label"><AlignLeft size={12} /> Description</label>
                <textarea
                  rows={3}
                  placeholder="Extra context or notes..."
                  className="retro-input"
                  style={{ resize: 'vertical' }}
                  {...register('description')}
                />
              </div>

              {/* Status + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="retro-label"><Activity size={12} /> Status</label>
                  <select className="retro-input" style={{ appearance: 'none' }} {...register('status')}>
                    <option value="todo">TODO</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                  </select>
                </div>
                <div>
                  <label className="retro-label"><Flag size={12} /> Priority</label>
                  <select className="retro-input" style={{ appearance: 'none' }} {...register('priority')}>
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="retro-label"><Calendar size={12} /> Due date</label>
                <input type="date" className="retro-input" {...register('due_date')} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px', borderTop: '2px solid var(--dark)', paddingTop: '14px' }}>
                <button type="button" onClick={onClose} className="btn-retro-ghost" style={{ flex: 1, height: '36px' }}>
                  [ CANCEL ]
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-retro btn-retro-purple"
                  style={{ flex: 1, height: '36px', opacity: isSubmitting ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isSubmitting ? 'WORKING...' : editing ? '[ SAVE CHANGES ]' : '[ CREATE TASK ]'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
