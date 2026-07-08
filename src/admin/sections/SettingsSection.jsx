import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn } from './DashboardOverview'

function Toggle({ id, defaultChecked }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button id={id} onClick={() => setOn(o => !o)} style={{
      width: 44, height: 24, borderRadius: 12, background: on ? '#c8f542' : 'rgba(242,235,220,0.12)',
      border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18,
        borderRadius: '50%', background: on ? '#080808' : 'rgba(242,235,220,0.4)',
        transition: 'left 0.2s', display: 'block',
      }} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(242,235,220,0.05)' }}>
      <div style={{ flex: 1, maxWidth: '60%' }}>
        <p style={{ fontSize: 12, fontWeight: 400, color: '#f2ebdc', margin: '0 0 3px' }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.35)', margin: 0, fontWeight: 300 }}>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Colors Manager ───────────────────────────────────────────────────────────
function ColorsManager() {
  const { colors, createColor, deleteColor } = useAdmin()
  const [form, setForm] = useState({ name: '', hexCode: '#000000' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try { await createColor({ name: form.name, hexCode: form.hexCode }); setForm({ name: '', hexCode: '#000000' }) }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 16px', fontWeight: 500 }}>Product Colors</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', marginBottom: 5 }}>Name</label>
          <input placeholder="e.g. Midnight Black" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 180 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', marginBottom: 5 }}>Hex</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="color" value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ width: 36, height: 36, border: '1px solid rgba(242,235,220,0.1)', background: 'none', cursor: 'pointer', padding: 2 }} />
            <input value={form.hexCode} onChange={e => setForm(f => ({ ...f, hexCode: e.target.value }))}
              style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 10px', fontSize: 11, fontFamily: 'monospace', outline: 'none', width: 90 }} />
          </div>
        </div>
        <AdminBtn variant="primary" onClick={handleCreate} disabled={saving} id="create-color-btn">{saving ? '…' : '+ Add'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#f87171', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {colors.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.08)', padding: '6px 12px' }}>
            <div style={{ width: 14, height: 14, background: c.hexCode, border: '1px solid rgba(242,235,220,0.2)', borderRadius: '50%', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.7)' }}>{c.name}</span>
            <span style={{ fontSize: 10, color: 'rgba(242,235,220,0.3)', fontFamily: 'monospace' }}>{c.hexCode}</span>
            <button onClick={() => deleteColor(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.2)', fontSize: 14, padding: '0 0 0 4px', lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,235,220,0.2)'}
            >×</button>
          </div>
        ))}
        {colors.length === 0 && <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.3)' }}>No colors yet.</p>}
      </div>
    </div>
  )
}

// ─── Sizes Manager ────────────────────────────────────────────────────────────
function SizesManager() {
  const { sizes, createSize, deleteSize } = useAdmin()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name required'); return }
    setSaving(true); setError('')
    try { await createSize({ name: name.trim() }); setName('') }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 16px', fontWeight: 500 }}>Product Sizes</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-end' }}>
        <input placeholder="e.g. XL" value={name} onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 140 }} />
        <AdminBtn variant="primary" onClick={handleCreate} disabled={saving} id="create-size-btn">{saving ? '…' : '+ Add'}</AdminBtn>
      </div>
      {error && <p style={{ fontSize: 11, color: '#f87171', margin: '0 0 12px' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {sizes.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.08)', padding: '6px 12px' }}>
            <span style={{ fontSize: 12, color: '#f2ebdc', fontWeight: 500, minWidth: 24, textAlign: 'center' }}>{s.name}</span>
            <button onClick={() => deleteSize(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.2)', fontSize: 14, lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,235,220,0.2)'}
            >×</button>
          </div>
        ))}
        {sizes.length === 0 && <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.3)' }}>No sizes yet.</p>}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SettingsSection() {
  const { adminUser, adminLogout } = useAdmin()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = ['general', 'store', 'catalogue', 'notifications', 'security', 'api']

  return (
    <div>
      <SectionHeader title="Settings" sub="Configure your MK 1974 admin panel" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 32, borderBottom: '1px solid rgba(242,235,220,0.07)', paddingBottom: 0, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 20px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid #c8f542' : '2px solid transparent',
            color: activeTab === t ? '#c8f542' : 'rgba(242,235,220,0.4)',
            transition: 'all 0.15s', marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: '4px 28px 24px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '24px 0 0', fontWeight: 500 }}>Admin Profile</p>
            <SettingRow label="Display Name" desc="Your name shown in the admin panel">
              <input defaultValue={adminUser?.name} style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220 }} />
            </SettingRow>
            <SettingRow label="Email Address" desc="Your admin login email">
              <input defaultValue={adminUser?.email} style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 220 }} />
            </SettingRow>
            <SettingRow label="Role" desc="Your permission level">
              <span style={{ fontSize: 11, color: '#c8f542', fontWeight: 500 }}>{adminUser?.role}</span>
            </SettingRow>
          </div>
          <AdminBtn variant="primary" id="save-general-settings">Save Changes</AdminBtn>
        </div>
      )}

      {activeTab === 'store' && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: '4px 28px 24px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '24px 0 0', fontWeight: 500 }}>Store Configuration</p>
            <SettingRow label="Store Name" desc="Public-facing brand name"><input defaultValue="MK 1974" style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 200 }} /></SettingRow>
            <SettingRow label="Currency" desc="Primary store currency"><input defaultValue="GBP (£)" style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 200 }} /></SettingRow>
            <SettingRow label="Free Shipping Threshold" desc="Minimum order for free UK shipping"><input defaultValue="£75" style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none', width: 200 }} /></SettingRow>
            <SettingRow label="Maintenance Mode" desc="Take the storefront offline temporarily"><Toggle id="maintenance-toggle" defaultChecked={false} /></SettingRow>
            <SettingRow label="Allow Guest Checkout" desc="Let customers buy without an account"><Toggle id="guest-checkout-toggle" defaultChecked={true} /></SettingRow>
          </div>
          <AdminBtn variant="primary" id="save-store-settings">Save Changes</AdminBtn>
        </div>
      )}

      {activeTab === 'catalogue' && (
        <div style={{ maxWidth: 760 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28, marginBottom: 20 }}>
            <ColorsManager />
          </div>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
            <SizesManager />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: '4px 28px 24px' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '24px 0 0', fontWeight: 500 }}>Email Notifications</p>
            {[
              { label: 'New order placed', desc: 'Alert when a customer places an order', id: 'notif-new-order', default: true },
              { label: 'Payment received', desc: 'Alert on successful payment confirmation', id: 'notif-payment', default: true },
              { label: 'Low stock alert', desc: 'Alert when product stock drops below 10', id: 'notif-low-stock', default: true },
              { label: 'New review submitted', desc: 'Alert when a customer submits a review', id: 'notif-review', default: false },
              { label: 'New customer signup', desc: 'Alert when a new account is created', id: 'notif-signup', default: false },
              { label: 'Daily sales report', desc: 'Receive a daily summary email at 8am', id: 'notif-daily', default: true },
            ].map(n => (
              <SettingRow key={n.id} label={n.label} desc={n.desc}>
                <Toggle id={n.id} defaultChecked={n.default} />
              </SettingRow>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: '4px 28px 24px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '24px 0 0', fontWeight: 500 }}>Security Settings</p>
            <SettingRow label="Two-Factor Authentication" desc="Require 2FA for all admin logins"><Toggle id="2fa-toggle" defaultChecked={false} /></SettingRow>
            <SettingRow label="Session Timeout" desc="Auto-logout after inactivity">
              <select style={{ background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '8px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", outline: 'none' }}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>8 hours</option>
                <option>Never</option>
              </select>
            </SettingRow>
            <SettingRow label="Login Attempt Limit" desc="Block after failed attempts"><Toggle id="login-limit-toggle" defaultChecked={true} /></SettingRow>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <AdminBtn variant="primary" id="change-password-btn">Change Password</AdminBtn>
            <AdminBtn variant="danger" onClick={adminLogout} id="security-logout-btn">Sign Out</AdminBtn>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ maxWidth: 720 }}>
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>API Configuration</p>
            {[
              { label: 'API Base URL', value: 'https://mk-brand-api.onrender.com' },
              { label: 'Swagger Docs', value: 'https://mk-brand-api.onrender.com/swagger/index.html' },
              { label: 'OpenAPI Spec', value: 'https://mk-brand-api.onrender.com/swagger/v1/swagger.json' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input readOnly defaultValue={value} style={{ flex: 1, background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.1)', color: '#f2ebdc', padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
                  <a href={value.startsWith('http') ? value : '#'} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#c8f542', textDecoration: 'none', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>↗ Open</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
