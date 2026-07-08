import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

export default function DiscountsSection() {
  const { discounts, toggleDiscount } = useAdmin()
  const [showForm, setShowForm] = useState(false)

  const active = discounts.filter(d => d.status === 'active').length
  const totalUsed = discounts.reduce((s, d) => s + d.used, 0)

  return (
    <div>
      <SectionHeader
        title="Discounts"
        sub={`${discounts.length} discount codes`}
        action={<AdminBtn id="add-discount-btn" variant="primary" onClick={() => setShowForm(s => !s)}>+ New Code</AdminBtn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Active Codes" value={active} accent="#c8f542" icon="%" />
        <StatCard label="Total Uses" value={totalUsed.toLocaleString()} icon="◎" />
        <StatCard label="Total Codes" value={discounts.length} icon="◈" />
        <StatCard label="Avg. Discount" value="22%" sub="Across all codes" icon="↓" />
      </div>

      {/* New code form */}
      {showForm && (
        <div style={{ background: 'rgba(200,245,66,0.04)', border: '1px solid rgba(200,245,66,0.15)', padding: 28, marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8f542', margin: '0 0 20px', fontWeight: 500 }}>Create Discount Code</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Code', placeholder: 'e.g. SUMMER25', id: 'dc-code' },
              { label: 'Discount %', placeholder: '20', id: 'dc-pct' },
              { label: 'Usage Limit', placeholder: '500 (leave blank = unlimited)', id: 'dc-limit' },
              { label: 'Expiry Date', placeholder: 'YYYY-MM-DD', id: 'dc-expiry' },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display: 'block', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.4)', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                <input id={f.id} placeholder={f.placeholder} style={{
                  width: '100%', background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.1)',
                  color: '#f2ebdc', padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif",
                  outline: 'none', boxSizing: 'border-box',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <AdminBtn variant="primary" id="create-discount-btn">Create Code</AdminBtn>
            <AdminBtn variant="ghost" onClick={() => setShowForm(false)}>Cancel</AdminBtn>
          </div>
        </div>
      )}

      {/* Discount code cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {discounts.map(d => (
          <div key={d.id} style={{
            background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24,
            opacity: d.status === 'expired' ? 0.5 : 1, transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => { if (d.status !== 'expired') e.currentTarget.style.borderColor = 'rgba(200,245,66,0.2)' }}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'}
          >
            {/* Code */}
            <div style={{ minWidth: 140 }}>
              <p style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: '#c8f542', margin: '0 0 4px', letterSpacing: '0.1em' }}>{d.code}</p>
              <StatusBadge status={d.status} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'Type', value: d.type === 'percentage' ? `${d.value}% off` : `£${d.value} off` },
                { label: 'Used', value: `${d.used}${d.limit ? ` / ${d.limit}` : ''}` },
                { label: 'Expires', value: d.expires || 'Never' },
                { label: 'Usage Rate', value: d.limit ? `${Math.round(d.used / d.limit * 100)}%` : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 4px' }}>{label}</p>
                  <p style={{ fontSize: 12, color: '#f2ebdc', margin: 0, fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Usage bar */}
            {d.limit && (
              <div style={{ width: 80 }}>
                <div style={{ height: 4, background: 'rgba(242,235,220,0.08)' }}>
                  <div style={{ height: '100%', background: '#c8f542', width: `${Math.min(d.used / d.limit * 100, 100)}%` }} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {d.status !== 'expired' && (
                <AdminBtn
                  variant={d.status === 'active' ? 'ghost' : 'success'}
                  onClick={() => toggleDiscount(d.id)}
                  id={`toggle-discount-${d.id}`}
                >{d.status === 'active' ? 'Deactivate' : 'Activate'}</AdminBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
