import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { Edit3, X, Calendar } from 'lucide-react'

const priorityColors = {
  low:    { bg: 'var(--val-gray)', fg: 'white',        label: 'LOW' },
  medium: { bg: 'var(--val-dark)', fg: 'var(--val-bg)',label: 'MEDIUM' },
  high:   { bg: 'var(--val-red)',  fg: 'white',        label: 'HIGH' },
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity:   isDragging ? 0.6 : 1,
    zIndex:    isDragging ? 50 : undefined,
  }

  const p = priorityColors[task.priority] || priorityColors.medium
  const initials = task.assignee_name
    ? task.assignee_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="val-card"
        style={{
          boxShadow: isDragging ? '8px 8px 0 rgba(255, 70, 85, 0.15)' : 'none',
          borderColor: isDragging ? 'var(--val-red)' : 'var(--val-dark)',
          transform: isDragging ? 'scale(1.02)' : 'none',
          cursor: 'grab',
          touchAction: 'none',
          position: 'relative',
          padding: '16px 16px 16px 20px',
        }}
        {...attributes}
        {...listeners}
      >
        {/* Priority stripe on left edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: p.bg }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'Anton', fontSize: '14px', letterSpacing: '0.05em', padding: '2px 8px', background: p.bg, color: p.fg }}>
            {p.label}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onEdit?.(task) }}
              style={{ padding: '4px', background: 'transparent', border: 'none', color: 'var(--val-dark)', cursor: 'pointer' }}
              title="Edit"
            >
              <Edit3 size={14} />
            </button>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onDelete?.(task.id) }}
              style={{ padding: '4px', background: 'transparent', border: 'none', color: 'var(--val-red)', cursor: 'pointer' }}
              title="Delete"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        <p style={{ fontFamily: 'Anton', fontSize: '20px', lineHeight: 1.2, margin: '8px 0', color: 'var(--val-dark)', wordBreak: 'break-word' }}>
          {task.title.toUpperCase()}
        </p>

        {task.description && (
          <p style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, color: 'var(--val-gray)', margin: '0 0 12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {task.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid var(--val-bg-alt)' }}>
          {task.due_date ? (
            <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, color: 'var(--val-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={12} /> {format(new Date(task.due_date), 'dd MMM').toUpperCase()}
            </span>
          ) : <span />}

          {initials && (
            <span
              style={{
                width: '28px', height: '28px',
                background: 'var(--val-red)',
                color: 'white',
                fontFamily: 'Anton', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
              }}
              title={task.assignee_name}
            >
              {initials}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
