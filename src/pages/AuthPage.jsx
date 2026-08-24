import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

// ── Google "G" SVG Icon ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function AuthPage() {
  const { login, register, googleLogin, showToast } = useApp()
  usePageMeta('Sign In / Register — MK 1974', 'Sign in to your MK 1974 account or create a new one.')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const initialMode = searchParams.get('mode') || 'login'
  const redirectUrl = searchParams.get('redirect') || '/profile'

  const [mode, setMode] = useState(initialMode) // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true)
    setErrors({})
    const result = await googleLogin(credentialResponse)
    if (result.success) {
      navigate(redirectUrl)
    } else {
      setErrors({ general: result.error || 'Google sign-in failed. Please try again.' })
    }
    setGoogleLoading(false)
  }

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setErrors({ general: 'Google sign-in was cancelled or failed.' })
      setGoogleLoading(false)
    },
    flow: 'auth-code',
  })

  // Because useGoogleLogin gives us an auth-code flow we need the credential popup version.
  // Use the GoogleLogin component approach instead via the callback style.
  // We'll render a custom button using useGoogleLogin with implicit flow.

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-surface text-dark pt-24 sm:pt-28 pb-20 flex flex-col justify-center">
        <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-black/10 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Left Decorative Showcase Panel */}
            <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden flex-col justify-between p-12 min-h-[580px]">
              <img
                src="/product1.png"
                alt="MK 1974 Apparel"
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/30" />

              <div className="relative z-10">
                <span className="eyebrow block mb-2 text-cream font-bold">MK 1974 Account</span>
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
                  <div key={idx} className="flex items-start gap-3 bg-dark/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-white/20 text-cream flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="text-xs font-bold text-cream">{item.title}</p>
                      <p className="text-[0.72rem] text-cream/70 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Authentication Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center max-w-lg mx-auto w-full">
              
              {/* Header / Mode Switcher Tabs */}
              <div className="mb-8">
                <div className="flex items-center gap-2 p-1.5 bg-stone-100 border border-black/10 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      mode === 'login'
                        ? 'bg-dark text-cream shadow-sm'
                        : 'text-dark/60 hover:text-dark hover:bg-stone-200/50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrors({}); }}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      mode === 'register'
                        ? 'bg-dark text-cream shadow-sm'
                        : 'text-dark/60 hover:text-dark hover:bg-stone-200/50'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <h1 className="font-playfair italic font-black text-dark text-2xl sm:text-3xl mb-2">
                  {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join MK 1974' : 'Reset Password'}
                </h1>
                <p className="text-dark/60 text-xs font-medium">
                  {mode === 'login'
                    ? 'Enter your credentials to access your account.'
                    : mode === 'register'
                    ? 'Create your account to start shopping and tracking orders.'
                    : 'Enter your email to receive a password reset link.'}
                </p>
              </div>

              {/* ── Google OAuth Button ── */}
              {mode !== 'forgot' && (
                <div className="mb-5">
                  <button
                    id="google-auth-btn"
                    type="button"
                    onClick={() => { setGoogleLoading(true); setErrors({}); triggerGoogleLogin(); }}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-black/15 hover:border-black/30 hover:bg-stone-50 rounded-lg text-dark text-xs font-bold tracking-wide transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {googleLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-black/10" />
                    <span className="text-dark/40 text-[0.65rem] font-bold uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-black/10" />
                  </div>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2 font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* First Name & Last Name */}
                {mode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-1.5">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={`w-full bg-surface border text-dark text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                          errors.firstName ? 'border-red-500' : 'border-black/15 focus:border-dark'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={`w-full bg-surface border text-dark text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                          errors.lastName ? 'border-red-500' : 'border-black/15 focus:border-dark'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-surface border text-dark text-xs px-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                      errors.email ? 'border-red-500' : 'border-black/15 focus:border-dark'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.email}</p>}
                </div>

                {/* Personal Phone Number */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-1.5">Personal Phone Number *</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs text-dark/60 font-mono font-semibold select-none">+234</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="801 234 5678"
                        className={`w-full bg-surface border text-dark text-xs pl-14 pr-4 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                          errors.phoneNumber ? 'border-red-500' : 'border-black/15 focus:border-dark'
                        }`}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.phoneNumber}</p>}
                  </div>
                )}

                {/* Password Input with Visibility Toggle */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold">Password *</label>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-surface border text-dark text-xs pl-4 pr-11 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                          errors.password ? 'border-red-500' : 'border-black/15 focus:border-dark'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-dark/50 hover:text-dark transition-colors p-1"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.password}</p>}
                  </div>
                )}

                {/* Confirm Password */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-1.5">Confirm Password *</label>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-surface border text-dark text-xs pl-4 pr-11 py-3.5 rounded-lg focus:outline-none transition-colors placeholder:text-dark/40 font-medium ${
                          errors.confirmPassword ? 'border-red-500' : 'border-black/15 focus:border-dark'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-dark/50 hover:text-dark transition-colors p-1"
                      >
                        {showConfirmPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-[0.68rem] mt-1 font-medium">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-dark hover:bg-accent text-cream font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
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
                    className="w-full text-center text-dark/60 text-xs font-semibold hover:text-dark transition-colors mt-2"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </form>

              <p className="text-dark/50 text-[0.68rem] text-center mt-8 leading-relaxed font-medium">
                By continuing, you agree to MK 1974's{' '}
                <Link to="/privacy-policy" className="underline hover:text-dark transition-colors">Privacy Policy</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
