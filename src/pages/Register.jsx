import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/authStore.js'

export default function Register() {
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [serverErr, setServerErr] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const pwd = watch('password')

  async function onSubmit({ name, email, password }) {
    setServerErr('')
    const r = await registerUser(name, email, password)
    if (r.success) navigate('/')
    else setServerErr(r.error)
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
        <div className="retro-window">
          <div className="retro-window-bar">
            <div className="retro-window-dots">
              <span style={{ background: '#ff6b6b' }} />
              <span style={{ background: '#ffd93d' }} />
              <span style={{ background: '#6bcb77' }} />
            </div>
            TASKFLOW.EXE — NEW USER REGISTRATION
          </div>

          <div style={{ padding: '28px 28px 24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid var(--dark)' }}>
              <h1 style={{ fontFamily: 'VT323', fontSize: '48px', lineHeight: 1, letterSpacing: '0.05em' }}>
                CREATE <span style={{ color: 'var(--green)' }}>ACCOUNT</span>
              </h1>
              <p style={{ fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--dark)', marginTop: '4px', letterSpacing: '0.08em', opacity: 0.7 }}>
                &gt; ENTER YOUR DETAILS BELOW
              </p>
            </div>

            {serverErr && (
              <div className="retro-error" style={{ marginBottom: '14px' }}>
                <span style={{ fontFamily: 'VT323', fontSize: '20px' }}>ERR:</span>
                {serverErr}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: 'name',            label: 'Full name',       type: 'text',     ph: 'Jane Doe',         rules: { required: 'Name required', minLength: { value: 2, message: 'Too short' } } },
                { key: 'email',           label: 'Email address',   type: 'email',    ph: 'user@domain.com',  rules: { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } },
                { key: 'password',        label: 'Password',        type: 'password', ph: '8+ characters',    rules: { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } } },
                { key: 'confirmPassword', label: 'Confirm password', type: 'password', ph: 'Repeat password',  rules: { required: 'Please confirm', validate: v => v === pwd || 'Passwords do not match' } },
              ].map((f, i) => (
                <div key={f.key}>
                  <label className="retro-label">&#x25B6; {f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    autoFocus={i === 0}
                    autoComplete={f.key === 'email' ? 'email' : f.key === 'name' ? 'name' : 'off'}
                    className={`retro-input ${errors[f.key] ? 'error' : ''}`}
                    {...register(f.key, f.rules)}
                  />
                  {errors[f.key] && (
                    <p style={{ fontSize: '11px', color: 'var(--pink)', marginTop: '3px', fontWeight: 700 }}>
                      {errors[f.key].message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-retro btn-retro-green"
                style={{ marginTop: '6px', width: '100%', justifyContent: 'center', fontSize: '14px' }}
              >
                {isLoading ? '[ PROCESSING... ]' : '[ CREATE ACCOUNT ]'}
              </button>
            </form>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: 'var(--purple)' }}>&#x25B6;</span>
              <span>Already registered?</span>
              <Link to="/login" style={{ color: 'var(--purple)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                SIGN IN
              </Link>
            </div>
          </div>
        </div>

        <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: 'var(--dark)', letterSpacing: '0.1em', opacity: 0.5 }}>
          TASKFLOW CORP. &copy; 1984 — ALL RIGHTS RESERVED
        </p>
      </motion.div>
    </div>
  )
}
