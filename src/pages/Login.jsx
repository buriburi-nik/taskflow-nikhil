import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/authStore.js'

export default function Login() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [serverErr, setServerErr] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  async function onSubmit({ email, password }) {
    setServerErr('')
    const r = await login(email, password)
    if (r.success) navigate('/')
    else setServerErr(r.error)
  }

  const fillDemo = () => {
    setValue('email', 'test@example.com', { shouldValidate: true })
    setValue('password', 'password123', { shouldValidate: true })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--cream)', backgroundImage: 'radial-gradient(rgba(28,20,34,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Window chrome */}
        <div className="retro-window">
          <div className="retro-window-bar">
            <div className="retro-window-dots">
              <span style={{ background: '#ff6b6b' }} />
              <span style={{ background: '#ffd93d' }} />
              <span style={{ background: '#6bcb77' }} />
            </div>
            TASKFLOW.EXE — USER LOGIN
          </div>

          <div style={{ padding: '28px 28px 24px' }}>
            {/* Logo area */}
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--dark)' }}>
              <h1
                style={{
                  fontFamily: 'VT323, monospace',
                  fontSize: '60px',
                  lineHeight: 1,
                  color: 'var(--dark)',
                  letterSpacing: '0.05em',
                }}
              >
                TASK<span style={{ color: 'var(--purple)' }}>FLOW</span>
              </h1>
              <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--purple)', marginTop: '4px', letterSpacing: '0.1em' }}>
                &gt; PRODUCTIVITY MANAGEMENT SYSTEM v1.0_
              </p>
            </div>

            {/* Error */}
            {serverErr && (
              <div className="retro-error" style={{ marginBottom: '16px' }}>
                <span style={{ fontFamily: 'VT323', fontSize: '20px' }}>ERR:</span>
                {serverErr}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="retro-label">&#x25B6; Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="user@domain.com"
                  className={`retro-input ${errors.email ? 'error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p style={{ fontSize: '11px', color: 'var(--pink)', marginTop: '4px', fontWeight: 700 }}>{errors.email.message}</p>}
              </div>

              <div>
                <label className="retro-label">&#x25B6; Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`retro-input ${errors.password ? 'error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                {errors.password && <p style={{ fontSize: '11px', color: 'var(--pink)', marginTop: '4px', fontWeight: 700 }}>{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-retro btn-retro-purple"
                style={{ marginTop: '6px', width: '100%', justifyContent: 'center', fontSize: '14px', position: 'relative' }}
              >
                {isLoading ? '[ LOADING... ]' : '[ SIGN IN ]'}
              </button>
            </form>


            <button
              type="button"
              onClick={fillDemo}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '10px 12px',
                background: 'var(--yellow)',
                border: '2px solid var(--dark)',
                fontSize: '11px',
                lineHeight: 1.6,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f7d358'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--dark)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--yellow)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>DEMO CREDENTIALS (CLICK TO FILL):</div>
              <div>EMAIL: test@example.com</div>
              <div>PASS:  password123</div>
            </button>

            {/* Register link */}
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: 'var(--purple)' }}>&#x25B6;</span>
              <span>No account?</span>
              <Link
                to="/register"
                style={{ color: 'var(--purple)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                CREATE ONE
              </Link>
            </div>
          </div>
        </div>

        {/* Below window — watermark style */}
        <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--dark)', letterSpacing: '0.1em', opacity: 0.5 }}>
          TASKFLOW CORP. &copy; 1984 — ALL RIGHTS RESERVED
        </p>
      </motion.div>
    </div>
  )
}
