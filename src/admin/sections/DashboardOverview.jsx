import { useAdmin } from '../context/AdminContext'

// ─── Shared UI ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
      padding: '24px 28px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 10px', fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: 30, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: accent || '#f2ebdc', margin: 0, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.35)', margin: '8px 0 0', fontWeight: 300 }}>{sub}</p>}
        </div>
        <span style={{ fontSize: 24, opacity: 0.15 }}>{icon}</span>
      </div>
    </div>
  )
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#c8f542', margin: '0 0 6px', fontWeight: 500 }}>Admin</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#f2ebdc', fontSize: 28, margin: 0 }}>{title}</h2>
        {sub && <p style={{ color: 'rgba(242,235,220,0.4)', fontSize: 12, margin: '6px 0 0', fontWeight: 300 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(242,235,220,0.08)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(242,235,220,0.04)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,235,220,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '14px 16px', color: j === 0 ? '#f2ebdc' : 'rgba(242,235,220,0.55)', fontWeight: j === 0 ? 400 : 300 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    delivered: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'Delivered' },
    processing: { bg: 'rgba(234,179,8,0.1)', color: '#fbbf24', label: 'Processing' },
    awaiting_payment: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: 'Awaiting Payment' },
    shipped: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', label: 'Shipped' },
    cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', label: 'Cancelled' },
    active: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'Active' },
    inactive: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', label: 'Inactive' },
    expired: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: 'Expired' },
    approved: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'Approved' },
    pending: { bg: 'rgba(234,179,8,0.1)', color: '#fbbf24', label: 'Pending' },
    vip: { bg: 'rgba(200,245,66,0.1)', color: '#c8f542', label: 'VIP' },
    instock: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'In Stock' },
    outofstock: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: 'Out of Stock' },
  }
  const s = map[status] || { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', label: status }
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      background: s.bg, color: s.color,
      fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
    }}>{s.label}</span>
  )
}

export function AdminBtn({ children, onClick, variant = 'primary', id, disabled }) {
  const styles = {
    primary: { background: '#c8f542', color: '#080808' },
    ghost: { background: 'transparent', color: '#f2ebdc', border: '1px solid rgba(242,235,220,0.15)' },
    danger: { background: 'transparent', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' },
    success: { background: 'transparent', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
  }
  return (
    <button id={id} onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: '8px 18px', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em',
      textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
      transition: 'opacity 0.2s', opacity: disabled ? 0.5 : 1,
      border: styles[variant].border || 'none',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >{children}</button>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data, labels, color = '#c8f542', height = 160, prefix = '' }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 20 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', background: color, opacity: 0.8,
            height: `${(v / max) * 100}%`,
            minHeight: 4, transition: 'height 0.4s cubic-bezier(.4,0,.2,1)',
            position: 'relative',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              const tip = e.currentTarget.querySelector('.tip')
              if (tip) tip.style.display = 'block'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.8'
              const tip = e.currentTarget.querySelector('.tip')
              if (tip) tip.style.display = 'none'
            }}
          >
            <div className="tip" style={{
              display: 'none', position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)',
              background: '#1a1a1a', border: '1px solid rgba(242,235,220,0.1)', padding: '4px 8px',
              fontSize: 10, color: '#f2ebdc', whiteSpace: 'nowrap', zIndex: 10,
            }}>{prefix}{v.toLocaleString()}</div>
          </div>
          <span style={{ fontSize: 9, color: 'rgba(242,235,220,0.3)', letterSpacing: '0.05em' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────
export default function DashboardOverview() {
  const { stats, orders, analytics, setActiveSection } = useAdmin()

  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <SectionHeader title="Dashboard" sub="Welcome back, Mohammed. Here's what's happening." />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Revenue" value={`£${stats.totalRevenue.toLocaleString()}`} sub="All time · delivered orders" accent="#c8f542" icon="£" />
        <StatCard label="Total Orders" value={stats.totalOrders} sub={`${stats.pendingOrders} pending action`} icon="◎" />
        <StatCard label="Customers" value={stats.totalCustomers} sub="Registered accounts" icon="◈" />
        <StatCard label="Products" value={stats.totalProducts} sub="In catalogue" icon="▦" />
      </div>

      {/* Revenue Chart + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Revenue — Last 12 Months</p>
          <BarChart data={analytics.revenue} labels={analytics.months} prefix="£" />
        </div>
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Top Products</p>
          {analytics.topProducts.map((p, i) => (
            <div key={p.name} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.6)', fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{p.name}</span>
                <span style={{ fontSize: 11, color: '#c8f542', fontWeight: 500 }}>{p.sold} sold</span>
              </div>
              <div style={{ height: 3, background: 'rgba(242,235,220,0.07)', position: 'relative' }}>
                <div style={{ height: '100%', background: '#c8f542', width: `${(p.sold / analytics.topProducts[0].sold) * 100}%`, opacity: 1 - i * 0.15 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: 0, fontWeight: 500 }}>Recent Orders</p>
          <AdminBtn variant="ghost" onClick={() => setActiveSection('orders')} id="view-all-orders-btn">View All</AdminBtn>
        </div>
        <Table
          headers={['Order', 'Customer', 'Items', 'Total', 'Status', 'Date']}
          rows={recentOrders.map(o => [
            <span style={{ color: '#c8f542', fontFamily: 'monospace', fontSize: 11 }}>{o.id}</span>,
            o.customer,
            o.items,
            `£${o.total}`,
            <StatusBadge status={o.status} />,
            o.date,
          ])}
        />
      </div>
    </div>
  )
}
