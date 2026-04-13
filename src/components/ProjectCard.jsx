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

  const barColors = ['var(--purple)', 'var(--pink)', 'var(--green)', 'var(--yellow)']
  const accentColor = barColors[index % barColors.length]
  const navigate = useNavigate()

  return (
    <div style={{ display: 'grid' }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.06 }}
        className="retro-card"
        style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%' }}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        {/* Colored title bar */}
        <div style={{ background: accentColor, padding: '6px 10px', borderBottom: '2px solid var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontFamily: 'VT323', fontSize: '18px', color: 'white', letterSpacing: '0.05em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Folder size={16} /> {project.name.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
                className="btn-retro-icon"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'white', width: '20px', height: '18px' }}
                title="Delete project"
              >×</button>
            )}
          </div>
        </div>

        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {project.description && (
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--dark)', opacity: 0.8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {project.description}
            </p>
          )}

          {/* Stats chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', padding: '1px 6px', border: '1px solid var(--dark)', background: 'var(--cream)' }}>
              <Folder size={12} /> {total} TASKS
            </span>
            {active > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '1px 6px', border: '1px solid var(--dark)', background: 'var(--yellow)' }}>
                <Clock size={12} /> {active} ACTIVE
              </span>
            )}
            {done > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '1px 6px', border: '1px solid var(--dark)', background: 'var(--green)', color: 'white' }}>
                <CheckCircle2 size={12} /> {done} DONE
              </span>
            )}
          </div>

          {/* Progress bar — old-style retro */}
          {total > 0 && (
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>PROGRESS</span>
                <span style={{ color: accentColor }}>{pct}%</span>
              </div>
              <div style={{ height: '14px', border: '2px solid var(--dark)', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  style={{ position: 'absolute', inset: 0, right: 'auto', background: accentColor }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
                  mixBlendMode: 'overlay',
                }} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px dashed var(--gray)' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.05em', opacity: 0.6 }}>
              {project.created_at ? formatDistanceToNow(new Date(project.created_at), { addSuffix: true }).toUpperCase() : 'JUST NOW'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--purple)' }}>OPEN &#x25B6;</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
