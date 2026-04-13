import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/authStore.js'

export default function Login() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [serverErr, setServerErr] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const controls = useAnimation()

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

  // 3D Parallax Mouse Move effect for the Cinematic Background
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      // Calculate mouse vector from center
      const x = (e.clientX / innerWidth - 0.5) * 20  // max 10px shift
      const y = (e.clientY / innerHeight - 0.5) * 20 // max 10px shift
      controls.start({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [controls])

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--val-bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* MASSIVE BACKGROUND TEXT */}
      <h1 
        style={{ 
          position: 'absolute', 
          top: '-40px', 
          left: '-20px', 
          fontSize: 'clamp(100px, 25vw, 300px)', 
          color: 'var(--val-dark)', 
          opacity: 0.03, 
          zIndex: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none'
        }}
      >
        TASKFLOW
      </h1>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 z-10" style={{ maxWidth: '600px' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: 'clamp(40px, 10vw, 80px)', color: 'var(--val-dark)', margin: 0, position: 'relative', display: 'inline-block' }}>
              SIGN IN
              <div style={{ position: 'absolute', bottom: '15px', right: '-15px', width: '10px', height: '10px', background: 'var(--val-red)' }}></div>
            </h1>
            <p style={{ fontFamily: 'Rajdhani', fontSize: 'clamp(16px, 4vw, 20px)', color: 'var(--val-gray)', fontWeight: 600, marginTop: '-10px' }}>
              ENTER YOUR CREDENTIALS TO ACCESS THE PROTOCOL.
            </p>
          </div>

          {serverErr && (
            <div className="val-error" style={{ marginBottom: '24px' }}>
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="val-label">EMAIL</label>
              <input
                type="email"
                autoComplete="email"
                autoFocus
                className={`val-input ${errors.email ? 'error' : ''}`}
                {...register('email', {
                  required: 'EMAIL REQUIRES VALIDATION.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'INVALID FORMAT.' },
                })}
              />
              {errors.email && <p style={{ fontSize: '14px', color: 'var(--val-red)', marginTop: '6px', fontWeight: 700 }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="val-label">PASSWORD</label>
              <input
                type="password"
                autoComplete="current-password"
                className={`val-input ${errors.password ? 'error' : ''}`}
                {...register('password', {
                  required: 'PASSWORD REQUIRED.',
                })}
              />
              {errors.password && <p style={{ fontSize: '14px', color: 'var(--val-red)', marginTop: '6px', fontWeight: 700 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="val-btn"
              style={{ marginTop: '16px', padding: '20px 40px', alignSelf: 'flex-start' }}
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOGIN TO PROTOCOL'}
            </button>
          </form>

          <div style={{ marginTop: '32px', borderTop: '2px solid var(--val-dark)', paddingTop: '24px', opacity: 0.8 }}>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'Anton',
                fontSize: '20px',
                color: 'var(--val-dark)',
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
                textDecoration: 'underline',
                textDecorationColor: 'var(--val-red)',
                textUnderlineOffset: '4px'
              }}
            >
              BYPASS PROTOCOL (DEMO LOGIN)
            </button>
          </div>

          <div style={{ marginTop: '40px', fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 600 }}>
            <span style={{ color: 'var(--val-gray)' }}>NEW OPERATIVE? </span>
            <Link to="/register" style={{ color: 'var(--val-red)', textDecoration: 'none' }}>
              REGISTER HERE
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Right Side (Cinematic AI Generated Image Parallax) */}
      <div className="hidden lg:flex" style={{ flex: 1, backgroundColor: 'var(--val-dark)', position: 'relative', overflow: 'hidden' }}>
         <motion.img 
           src="/agent-bg.png" 
           alt="Agent Background" 
           animate={controls}
           style={{ 
             position: 'absolute', 
             top: '-5%', left: '-5%', 
             width: '110%', height: '110%', 
             objectFit: 'cover', 
             opacity: 0.8,
             mixBlendMode: 'screen',
             filter: 'contrast(1.2)'
           }} 
         />
         {/* Diagonal cut masking over the image */}
         <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100px', background: 'var(--val-bg)', clipPath: 'polygon(0 0, 100% 0, 0 100%)', zIndex: 10 }}></div>
         
         <div style={{ position: 'absolute', bottom: '10%', right: '10%', color: 'white', fontFamily: 'Anton', fontSize: '12vw', opacity: 0.3, lineHeight: 1, zIndex: 10, mixBlendMode: 'overlay' }}>
           01
         </div>
         <div style={{ position: 'absolute', top: '10%', right: '10%', textAlign: 'right', color: 'white', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '24px', letterSpacing: '0.2em', zIndex: 10 }}>
           <span style={{ color: 'var(--val-red)' }}>// </span>PROTOCOL
           <br/>
           <span style={{ color: 'var(--val-red)' }}>// </span>INITIALIZATION
         </div>
         
         {/* Grid overlay to strengthen the gaming vibe */}
         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 5, pointerEvents: 'none' }}></div>
      </div>
    </div>
  )
}
