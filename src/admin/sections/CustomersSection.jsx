import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard } from './DashboardOverview'

export default function CustomersSection() {
  const { customers } = useAdmin()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const vipCount = customers.filter(c => c.status === 'vip').length
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0)
  const avgOrderValue = Math.round(totalSpent / customers.reduce((s, c) => s + c.orders, 0))

  return (
    <div>
      <SectionHeader title="Customers" sub={`${customers.length} registered customers`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Customers" value={customers.length} icon="◈" />
        <StatCard label="VIP Customers" value={vipCount} accent="#c8f542" icon="★" />
        <StatCard label="Lifetime Revenue" value={`£${totalSpent.toLocaleString()}`} accent="#4ade80" icon="£" />
        <StatCard label="Avg. Order Value" value={`£${avgOrderValue}`} icon="◎" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          id="customer-search"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.1)',
            color: '#f2ebdc', padding: '9px 14px', fontSize: 12, fontFamily: "'Inter', sans-serif",
            outline: 'none', width: 240,
          }}
        />
        {['all', 'vip', 'active', 'inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 14px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: filter === f ? '#c8f542' : 'rgba(242,235,220,0.04)',
            color: filter === f ? '#080808' : 'rgba(242,235,220,0.5)',
            border: filter === f ? 'none' : '1px solid rgba(242,235,220,0.08)',
            transition: 'all 0.15s',
          }}>{f}</button>
        ))}
      </div>

      {/* Customer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} style={{
            background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
            padding: '22px 24px', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,245,66,0.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: c.status === 'vip' ? 'rgba(200,245,66,0.15)' : 'rgba(242,235,220,0.06)',
                border: `1px solid ${c.status === 'vip' ? 'rgba(200,245,66,0.3)' : 'rgba(242,235,220,0.1)'}`,
                fontSize: 14, fontWeight: 700, color: c.status === 'vip' ? '#c8f542' : 'rgba(242,235,220,0.6)',
              }}>
                {c.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#f2ebdc', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.4)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Orders', value: c.orders },
                { label: 'Spent', value: `£${c.totalSpent}` },
                { label: 'Joined', value: c.joined.slice(0, 7) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 3px' }}>{label}</p>
                  <p style={{ fontSize: 12, color: '#f2ebdc', margin: 0, fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>
            <AdminBtn variant="ghost" id={`view-customer-${c.id}`}>View Profile</AdminBtn>
          </div>
        ))}
      </div>
    </div>
  )
}
