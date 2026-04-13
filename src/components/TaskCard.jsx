import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { Edit3, X, Calendar } from 'lucide-react'

const priorityColors = {
  low:    { bg: 'var(--green)',  fg: 'white',     label: 'LOW'    },
  medium: { bg: 'var(--yellow)', fg: 'var(--dark)', label: 'MEDIUM' },
  high:   { bg: 'var(--pink)',   fg: 'white',     label: 'HIGH'   },
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity:   isDragging ? 0.4 : 1,
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
        style={{
          border: '2px solid var(--dark)',
          background: 'var(--white)',
          boxShadow: isDragging ? '6px 6px 0 var(--dark)' : '2px 2px 0 var(--dark)',
          transform: isDragging ? 'rotate(2.5deg)' : 'none',
          cursor: 'grab',
          position: 'relative',
          touchAction: 'none',
        }}
        {...attributes}
        {...listeners}
      >
        {/* Priority stripe on left edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: p.bg }} />

        <div style={{ padding: '10px 10px 10px 14px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span
              className="retro-badge"
              style={{ background: p.bg, color: p.fg, borderColor: p.bg }}
            >
              {p.label}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onEdit?.(task) }}
                style={{ width: '20px', height: '18px', background: 'var(--yellow)', border: '1px solid var(--dark)', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Edit"
              >
                <Edit3 size={12} />
              </button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onDelete?.(task.id) }}
                style={{ width: '20px', height: '18px', background: 'var(--pink)', border: '1px solid var(--dark)', fontSize: '11px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Delete"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Title */}
          <p style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.4, marginBottom: '4px', color: 'var(--dark)' }}>
            {task.title}
          </p>

          {task.description && (
            <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'var(--dark)', opacity: 0.7, marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed var(--gray)', marginTop: '4px' }}>
            {task.due_date ? (
              <span style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'var(--dark)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={10} /> {format(new Date(task.due_date), 'dd MMM').toUpperCase()}
              </span>
            ) : <span />}

            {initials && (
              <span
                style={{
                  width: '22px', height: '22px',
                  background: 'var(--purple)',
                  color: 'white',
                  fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--dark)',
                }}
                title={task.assignee_name}
              >
                {initials}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
