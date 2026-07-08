import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, AdminBtn, StatCard, Table } from './DashboardOverview'

const STATUS_OPTIONS = ['awaiting_payment', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersSection() {
  const { orders, updateOrderStatus, stats } = useAdmin()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const selectedOrder = orders.find(o => o.id === selected)

  const statusCounts = {
    all: orders.length,
    awaiting_payment: orders.filter(o => o.status === 'awaiting_payment').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div>
      <SectionHeader title="Orders" sub={`${orders.length} total orders · ${stats.pendingOrders} require action`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard label="Total" value={orders.length} icon="◎" />
        <StatCard label="Pending" value={statusCounts.awaiting_payment} accent="#f87171" icon="⏳" />
        <StatCard label="Processing" value={statusCounts.processing} accent="#fbbf24" icon="⚙" />
        <StatCard label="Shipped" value={statusCounts.shipped} accent="#60a5fa" icon="⬢" />
        <StatCard label="Delivered" value={statusCounts.delivered} accent="#4ade80" icon="✓" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 14px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            background: filter === s ? '#c8f542' : 'rgba(242,235,220,0.04)',
            color: filter === s ? '#080808' : 'rgba(242,235,220,0.5)',
            border: filter === s ? 'none' : '1px solid rgba(242,235,220,0.08)',
            transition: 'all 0.15s',
          }}>{s.replace('_', ' ')} {statusCounts[s] > 0 && `(${statusCounts[s]})`}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 16 }}>
        {/* Orders list */}
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(242,235,220,0.08)' }}>
                  {['Order ID', 'Customer', 'Country', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}
                    style={{ borderBottom: '1px solid rgba(242,235,220,0.04)', background: selected === o.id ? 'rgba(200,245,66,0.04)' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    onClick={() => setSelected(selected === o.id ? null : o.id)}
                    onMouseEnter={e => { if (selected !== o.id) e.currentTarget.style.background = 'rgba(242,235,220,0.02)' }}
                    onMouseLeave={e => { if (selected !== o.id) e.currentTarget.style.background = 'none' }}
                  >
                    <td style={{ padding: '14px 16px', color: '#c8f542', fontFamily: 'monospace', fontSize: 11, fontWeight: 600 }}>{o.id}</td>
                    <td style={{ padding: '14px 16px', color: '#f2ebdc' }}>{o.customer}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.5)' }}>{o.country}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.5)' }}>{o.items}</td>
                    <td style={{ padding: '14px 16px', color: '#f2ebdc', fontWeight: 500 }}>£{o.total}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} /></td>
                    <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.4)' }}>{o.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 14, color: 'rgba(242,235,220,0.3)' }}>{selected === o.id ? '›' : '›'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order detail panel */}
        {selectedOrder && (
          <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 4px' }}>Order</p>
                <p style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#c8f542', margin: 0 }}>{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.3)', fontSize: 18 }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 6px' }}>Customer</p>
              <p style={{ fontSize: 13, color: '#f2ebdc', margin: 0 }}>{selectedOrder.customer}</p>
              <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.4)', margin: '2px 0 0' }}>{selectedOrder.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total', value: `£${selectedOrder.total}` },
                { label: 'Items', value: selectedOrder.items },
                { label: 'Country', value: selectedOrder.country },
                { label: 'Date', value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(242,235,220,0.03)', padding: '10px 12px' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 4px' }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#f2ebdc', margin: 0, fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 10px' }}>Update Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)} style={{
                    padding: '8px 12px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif', textAlign: 'left'",
                    background: selectedOrder.status === s ? 'rgba(200,245,66,0.1)' : 'rgba(242,235,220,0.03)',
                    color: selectedOrder.status === s ? '#c8f542' : 'rgba(242,235,220,0.5)',
                    border: selectedOrder.status === s ? '1px solid rgba(200,245,66,0.3)' : '1px solid rgba(242,235,220,0.07)',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>{s.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
