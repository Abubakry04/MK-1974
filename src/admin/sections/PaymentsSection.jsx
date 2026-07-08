import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatusBadge, StatCard, Table } from './DashboardOverview'

const MOCK_PAYMENTS = [
  { id: 'PAY-8821', order: 'MK100281', customer: 'Marcus Thompson', amount: 278, method: 'Visa •••• 4242', status: 'success', date: '2025-06-18' },
  { id: 'PAY-8820', order: 'MK100280', customer: 'Leila Rahman', amount: 89, method: 'Apple Pay', status: 'success', date: '2025-06-17' },
  { id: 'PAY-8819', order: 'MK100279', customer: 'Jordan K.', amount: 154, method: 'PayPal', status: 'pending', date: '2025-06-17' },
  { id: 'PAY-8818', order: 'MK100278', customer: 'Amara Osei', amount: 129, method: 'Mastercard •••• 9012', status: 'success', date: '2025-06-16' },
  { id: 'PAY-8817', order: 'MK100277', customer: 'David Park', amount: 342, method: 'Visa •••• 5678', status: 'success', date: '2025-06-15' },
  { id: 'PAY-8816', order: 'MK100276', customer: 'Sophie Clarke', amount: 168, method: 'PayPal', status: 'refunded', date: '2025-06-14' },
  { id: 'PAY-8815', order: 'MK100275', customer: 'Malik Johnson', amount: 79, method: 'Apple Pay', status: 'success', date: '2025-06-13' },
]

const PAY_STATUS_MAP = {
  success: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', label: 'Paid' },
  pending: { bg: 'rgba(234,179,8,0.1)', color: '#fbbf24', label: 'Pending' },
  refunded: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: 'Refunded' },
  failed: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', label: 'Failed' },
}

function PayStatus({ status }) {
  const s = PAY_STATUS_MAP[status] || PAY_STATUS_MAP.failed
  return <span style={{ display: 'inline-block', padding: '3px 10px', background: s.bg, color: s.color, fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</span>
}

export default function PaymentsSection() {
  const { orders } = useAdmin()
  const totalRevenue = MOCK_PAYMENTS.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0)
  const refunded = MOCK_PAYMENTS.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <SectionHeader title="Payments" sub="Transaction and payment history" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Collected" value={`£${totalRevenue.toLocaleString()}`} accent="#c8f542" icon="£" />
        <StatCard label="Transactions" value={MOCK_PAYMENTS.length} icon="◎" />
        <StatCard label="Pending" value={MOCK_PAYMENTS.filter(p => p.status === 'pending').length} accent="#fbbf24" icon="⏳" />
        <StatCard label="Refunded" value={`£${refunded}`} accent="#f87171" icon="↩" />
      </div>

      {/* Payment methods breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Recent Transactions</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(242,235,220,0.08)' }}>
                  {['Payment ID', 'Order', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYMENTS.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(242,235,220,0.04)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,235,220,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <td style={{ padding: '13px 14px', color: '#c8f542', fontFamily: 'monospace', fontSize: 10 }}>{p.id}</td>
                    <td style={{ padding: '13px 14px', color: 'rgba(242,235,220,0.6)', fontFamily: 'monospace', fontSize: 10 }}>{p.order}</td>
                    <td style={{ padding: '13px 14px', color: '#f2ebdc' }}>{p.customer}</td>
                    <td style={{ padding: '13px 14px', color: '#f2ebdc', fontWeight: 500 }}>£{p.amount}</td>
                    <td style={{ padding: '13px 14px', color: 'rgba(242,235,220,0.5)', fontSize: 11 }}>{p.method}</td>
                    <td style={{ padding: '13px 14px' }}><PayStatus status={p.status} /></td>
                    <td style={{ padding: '13px 14px', color: 'rgba(242,235,220,0.4)' }}>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Payment Methods</p>
          {[
            { method: 'Visa', count: 3, pct: 43 },
            { method: 'Apple Pay', count: 2, pct: 28 },
            { method: 'PayPal', count: 2, pct: 28 },
          ].map(m => (
            <div key={m.method} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.6)' }}>{m.method}</span>
                <span style={{ fontSize: 11, color: '#c8f542' }}>{m.pct}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(242,235,220,0.07)' }}>
                <div style={{ height: '100%', background: '#c8f542', width: `${m.pct}%`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
