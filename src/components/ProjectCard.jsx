import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Folder, Clock, CheckCircle2 } from 'lucide-react'

export default function ProjectCard({ project, index, onDelete }) {
  const tasks = project.tasks || []
  const done = tasks.filter(t => t.status === 'done').length
  const active = tasks.filter(t => t.status === 'in_progress').length
  const total = tasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const navigate = useNavigate()

  return (
    <div style={{ display: 'grid', perspective: '1000px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
        whileHover={{
          rotateX: 2,
          rotateY: -2,
          scale: 1.02,
          z: 20,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="val-card val-card-3d val-card-hover"
        style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%', overflow: 'hidden' }}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        {/* Red thin top-bar decor */}
        <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '40px', background: 'var(--val-red)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Anton', fontSize: '28px', color: 'var(--val-dark)', letterSpacing: '0.05em', lineHeight: 1.1, wordBreak: 'break-word', textShadow: '2px 2px 0 var(--val-light)' }}>
              {project.name.toUpperCase()}
            </span>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
                style={{ background: 'var(--val-light)', border: '1px solid var(--val-dark)', color: 'var(--val-dark)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px))', boxShadow: '2px 2px 0 var(--val-bg-alt)' }}
                title="Delete project"
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--val-red)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--val-red)'; e.currentTarget.style.boxShadow = '2px 2px 0 rgba(255,70,85,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--val-light)'; e.currentTarget.style.color = 'var(--val-dark)'; e.currentTarget.style.borderColor = 'var(--val-dark)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--val-bg-alt)'; }}
              >×</button>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600, color: 'var(--val-gray)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {project.description}
            </p>
          )}

          {/* Stats Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'Anton', letterSpacing: '0.05em', padding: '4px 8px', background: 'var(--val-bg-alt)', color: 'var(--val-dark)' }}>
              <Folder size={14} /> {total} TASKS
            </span>
            {active > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'Anton', letterSpacing: '0.05em', padding: '4px 8px', background: 'var(--val-gray)', color: 'white' }}>
                <Clock size={14} /> {active} ACTIVE
              </span>
            )}
            {done > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'Anton', letterSpacing: '0.05em', padding: '4px 8px', background: 'var(--val-red)', color: 'white' }}>
                <CheckCircle2 size={14} /> {done} DONE
              </span>
            )}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontFamily: 'Anton', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', color: 'var(--val-dark)' }}>
                <span>COMPLETION</span>
                <span style={{ color: 'var(--val-red)' }}>{pct}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--val-bg-alt)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: 0, right: 'auto', background: 'var(--val-red)' }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid var(--val-bg-alt)' }}>
            <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 600, color: 'var(--val-gray)', letterSpacing: '0.05em' }}>
              {project.created_at ? formatDistanceToNow(new Date(project.created_at), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
            </span>
            <span style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700, color: 'var(--val-red)', letterSpacing: '0.05em' }}>
              ACCESS DECK //
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
