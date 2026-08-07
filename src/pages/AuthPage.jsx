import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

export default function AuthPage() {
  const { login, register, showToast } = useApp()
  usePageMeta('Sign In / Register — MK 1974', 'Sign in to your MK 1974 account or create a new one.')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const initialMode = searchParams.get('mode') || 'login'
  const redirectUrl = searchParams.get('redirect') || '/profile'

  const [mode, setMode] = useState(initialMode) // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address'
    }

    if (mode !== 'forgot') {
      if (!form.password) {
        errs.password = 'Password is required'
      } else if (form.password.length < 6) {
        errs.password = 'Password must be at least 6 characters'
      }
    }

    if (mode === 'register') {
      if (!form.firstName.trim()) errs.firstName = 'First name is required'
      if (!form.lastName.trim()) errs.lastName = 'Last name is required'
      if (!form.phoneNumber.trim()) {
        errs.phoneNumber = 'Phone number is required'
      } else if (!/^[0-9+\s-]{7,15}$/.test(form.phoneNumber.trim())) {
        errs.phoneNumber = 'Please enter a valid phone number'
      }
      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      if (mode === 'login') {
        const result = await login({ email: form.email.trim(), password: form.password })
        if (result.success) {
          navigate(redirectUrl)
        } else {
          setErrors({ general: result.error || 'Invalid email or password.' })
        }
      } else if (mode === 'register') {
        const result = await register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          phone: form.phoneNumber.trim(),
          password: form.password
        })
        if (result.success) {
          navigate(redirectUrl)
        } else {
          setErrors({ general: result.error || 'Registration failed. Please try again.' })
        }
      } else {
        showToast('Password reset link sent to ' + form.email)
        setMode('login')
      }
    } catch (err) {
      setErrors({ general: err.message || 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-dark text-cream pt-24 sm:pt-28 pb-20 flex flex-col justify-center">
        <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Left Decorative Showcase Panel */}
            <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden flex-col justify-between p-12 min-h-[580px]">
              <img
                src="/product1.png"
                alt="MK 1974 Apparel"
                className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

              <div className="relative z-10">
                <span className="eyebrow block mb-2 text-lime font-bold">MK 1974 Account</span>
                <h2 className="font-playfair italic font-black text-cream text-4xl leading-tight">
                  Lagos Streetwear<br />Exclusives
                </h2>
              </div>

              <div className="relative z-10 space-y-4">
                {[
                  { title: 'Faster Checkout', desc: 'Pre-filled delivery details & direct order status tracking.' },
                  { title: 'Personal Wishlist', desc: 'Save your favourite drops and get back to them anytime.' },
                  { title: 'Order History', desc: 'Access all your past receipts, tracking IDs and order details.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-dark/60 backdrop-blur-md p-3.5 rounded-lg border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-lime/20 text-lime flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="text-xs font-bold text-cream">{item.title}</p>
                      <p className="text-[0.72rem] text-cream/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Authentication Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              
              {/* Header / Mode Switcher Tabs */}
              <div className="mb-8">
                <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      mode === 'login'
                        ? 'bg-lime text-dark shadow-md'
                        : 'text-cream/60 hover:text-cream hover:bg-white/5'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      mode === 'register'
                        ? 'bg-lime text-dark shadow-md'
                        : 'text-cream/60 hover:text-cream hover:bg-white/5'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <h1 className="font-playfair italic font-black text-cream text-2xl sm:text-3xl mb-2">
                  {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join MK 1974' : 'Reset Password'}
                </h1>
                <p className="text-cream/50 text-xs">
                  {mode === 'login'
                    ? 'Enter your credentials to access your account.'
                    : mode === 'register'
                    ? 'Create your account to start shopping and tracking orders.'
                    : 'Enter your email to receive a password reset link.'}
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* First Name & Last Name */}
                {mode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-1.5">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={`w-full bg-white/5 border text-cream text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                          errors.firstName ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-400 text-[0.68rem] mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={`w-full bg-white/5 border text-cream text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                          errors.lastName ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-400 text-[0.68rem] mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-white/5 border text-cream text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                      errors.email ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-[0.68rem] mt-1">{errors.email}</p>}
                </div>

                {/* Personal Phone Number */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-1.5">Personal Phone Number *</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs text-cream/50 font-mono select-none">+234</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="801 234 5678"
                        className={`w-full bg-white/5 border text-cream text-xs pl-14 pr-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                          errors.phoneNumber ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                        }`}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-400 text-[0.68rem] mt-1">{errors.phoneNumber}</p>}
                  </div>
                )}

                {/* Password Input with Visibility Toggle */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60">Password *</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[0.68rem] text-lime hover:underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-white/5 border text-cream text-xs pl-4 pr-11 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                          errors.password ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-cream/40 hover:text-cream transition-colors p-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-[0.68rem] mt-1">{errors.password}</p>}
                  </div>
                )}

                {/* Confirm Password */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-1.5">Confirm Password *</label>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-white/5 border text-cream text-xs pl-4 pr-11 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-cream/30 ${
                          errors.confirmPassword ? 'border-red-500/60' : 'border-white/15 focus:border-lime'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-cream/40 hover:text-cream transition-colors p-1"
                      >
                        {showConfirmPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-[0.68rem] mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-lime hover:bg-lime-dim text-dark font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  ) : mode === 'login' ? (
                    'Sign In to Account'
                  ) : mode === 'register' ? (
                    'Create My Account'
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-cream/50 text-xs hover:text-cream transition-colors mt-2"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </form>

              <p className="text-cream/30 text-[0.68rem] text-center mt-8 leading-relaxed">
                By continuing, you agree to MK 1974's{' '}
                <Link to="/terms" className="underline hover:text-cream transition-colors">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="underline hover:text-cream transition-colors">Privacy Policy</Link>.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
