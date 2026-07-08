import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function AuthPage() {
  const { login, register, showToast } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // login | register | forgot
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (mode !== 'forgot') {
      if (!form.password) errs.password = 'Password is required'
      else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    }
    if (mode === 'register') {
      if (!form.firstName) errs.firstName = 'First name is required'
      if (!form.lastName) errs.lastName = 'Last name is required'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    if (mode === 'login') {
      const result = await login({ email: form.email, password: form.password })
      if (result.success) {
        navigate('/profile')
      } else {
        setErrors({ general: result.error })
      }
    } else if (mode === 'register') {
      const result = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      })
      if (result.success) {
        navigate('/profile')
      } else {
        setErrors({ general: result.error })
      }
    } else {
      showToast('Password reset link sent to ' + form.email)
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-dark flex">
        {/* Left decorative panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img src="/hero.png" alt="MK 1974" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
            <p className="eyebrow mb-4">Member Exclusives</p>
            <h2 className="font-playfair font-black italic text-cream text-5xl leading-tight mb-4">
              Your MK 1974<br />Account
            </h2>
            <p className="text-cream/50 text-[0.88rem] font-light leading-[1.8] max-w-xs">
              Track orders, save favourites, get early access to new drops, and manage your profile — all in one place.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center px-8 py-24">
          <div className="w-full max-w-[420px]">
            <Link to="/" className="inline-block font-playfair italic font-black text-cream text-2xl mb-10 hover:text-lime transition-colors">MK 1974</Link>

            <div className="mb-8">
              <h1 className="font-playfair font-black italic text-cream text-3xl mb-2">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
              </h1>
              <p className="text-muted text-[0.82rem]">
                {mode === 'login' ? "Don't have an account?" : mode === 'register' ? 'Already have an account?' : null}
                {mode !== 'forgot' && (
                  <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-lime hover:text-lime-dim transition-colors ml-1.5 underline">
                    {mode === 'login' ? 'Register' : 'Sign In'}
                  </button>
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3">
                  {errors.general}
                </div>
              )}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  {['firstName', 'lastName'].map(field => (
                    <div key={field}>
                      <input
                        type="text"
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
                        className={`w-full bg-surface border text-cream text-[0.85rem] px-4 py-3.5 focus:outline-none transition-colors placeholder-muted ${errors[field] ? 'border-red-500/60' : 'border-white/10 focus:border-lime/40'}`}
                      />
                      {errors[field] && <p className="text-red-400 text-[0.65rem] mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full bg-surface border text-cream text-[0.85rem] px-4 py-3.5 focus:outline-none transition-colors placeholder-muted ${errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-lime/40'}`}
                />
                {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full bg-surface border text-cream text-[0.85rem] px-4 py-3.5 focus:outline-none transition-colors placeholder-muted ${errors.password ? 'border-red-500/60' : 'border-white/10 focus:border-lime/40'}`}
                  />
                  {errors.password && <p className="text-red-400 text-[0.65rem] mt-1">{errors.password}</p>}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className={`w-full bg-surface border text-cream text-[0.85rem] px-4 py-3.5 focus:outline-none transition-colors placeholder-muted ${errors.confirmPassword ? 'border-red-500/60' : 'border-white/10 focus:border-lime/40'}`}
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-[0.65rem] mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode('forgot')} className="text-muted text-[0.72rem] hover:text-cream transition-colors">Forgot password?</button>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                ) : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
              </button>

              {mode === 'forgot' && (
                <button type="button" onClick={() => setMode('login')} className="w-full text-center text-muted text-[0.72rem] hover:text-cream transition-colors mt-2">
                  ← Back to Sign In
                </button>
              )}
            </form>

            <p className="text-muted/50 text-[0.65rem] text-center mt-8 leading-[1.8]">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-muted transition-colors">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="underline hover:text-muted transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
