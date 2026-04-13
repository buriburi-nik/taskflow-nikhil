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
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="val-card"
            style={{ width: '100%', maxWidth: '480px', padding: 0 }}
          >
            <div style={{ background: 'var(--val-dark)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Anton', fontSize: '24px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editing ? <Edit3 size={18} /> : <Plus size={18} />}
                {editing ? 'EDIT TASK' : 'NEW TASK'}
              </span>
              <button
                onClick={onClose}
                style={{ background: 'var(--val-red)', border: 'none', color: 'white', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="val-label"><Type size={14} style={{ display: 'inline-block', verticalAlign: 'text-top' }} /> TASK TITLE</label>
                <input
                  autoFocus
                  placeholder="EXACTLY WHAT NEEDS TO BE DONE?"
                  className={`val-input ${errors.title ? 'error' : ''}`}
                  {...register('title', { required: 'REQUIRED' })}
                />
                {errors.title && <p style={{ fontSize: '14px', color: 'var(--val-red)', marginTop: '4px', fontWeight: 700 }}>{errors.title.message}</p>}
              </div>

              <div>
                <label className="val-label"><AlignLeft size={14} style={{ display: 'inline-block', verticalAlign: 'text-top' }} /> DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="ADDITIONAL DIRECTIVES..."
                  className="val-input"
                  style={{ resize: 'vertical' }}
                  {...register('description')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="val-label"><Activity size={14} style={{ display: 'inline-block', verticalAlign: 'text-top' }} /> STATUS</label>
                  <select className="val-input" {...register('status')}>
                    <option value="todo">TODO</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                  </select>
                </div>
                <div>
                  <label className="val-label"><Flag size={14} style={{ display: 'inline-block', verticalAlign: 'text-top' }} /> PRIORITY</label>
                  <select className="val-input" {...register('priority')}>
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="val-label"><Calendar size={14} style={{ display: 'inline-block', verticalAlign: 'text-top' }} /> DUE DATE</label>
                <input type="date" className="val-input" {...register('due_date')} />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button type="button" onClick={onClose} className="val-btn secondary" style={{ flex: 1, fontSize: '16px' }}>
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="val-btn"
                  style={{ flex: 1, fontSize: '16px', opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting ? 'WORKING...' : editing ? 'SAVE CHANGES' : 'CREATE TASK'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
