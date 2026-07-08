import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function AdminLogin() {
  const { adminLogin } = useAdmin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setError('')
    setLoading(true)
    const result = await adminLogin(form)
    if (!result.success) setError(result.error)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)',
    color: '#f2ebdc', padding: '11px 14px', fontSize: 13, fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1f2127', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(200,245,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,245,66,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, background: '#c8f542', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18, color: '#080808', fontStyle: 'italic' }}>MK</span>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8f542', margin: 0, fontWeight: 500 }}>Admin</p>
              <p style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.5)', margin: 0, fontWeight: 300 }}>Control Panel</p>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#f2ebdc', fontSize: 28, margin: 0 }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 13, fontWeight: 300, marginTop: 8, marginBottom: 0 }}>
            Access the MK 1974 admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'rgba(242,235,220,0.03)', border: '1px solid rgba(242,235,220,0.08)', padding: 32, marginBottom: 16 }}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.45)', marginBottom: 8, fontWeight: 500 }}>
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@mk1974.com"
                value={form.email}
                onChange={set('email')}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c8f542'}
                onBlur={e => e.target.style.borderColor = 'rgba(242,235,220,0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.45)', marginBottom: 8, fontWeight: 500 }}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c8f542'}
                onBlur={e => e.target.style.borderColor = 'rgba(242,235,220,0.1)'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#f87171' }}>
                {error}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#9fb83a' : '#c8f542', color: '#080808',
                border: 'none', padding: '13px 24px', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.25em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif", transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing In…' : 'Sign In to Dashboard'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'rgba(242,235,220,0.2)', letterSpacing: '0.1em' }}>
          <a href="/" style={{ color: 'rgba(200,245,66,0.4)', textDecoration: 'none' }}>← Back to storefront</a>
        </p>
      </div>
    </div>
  )
}
