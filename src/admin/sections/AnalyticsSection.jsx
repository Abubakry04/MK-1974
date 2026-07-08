import { useAdmin } from '../context/AdminContext'
import { SectionHeader, StatCard, BarChart } from './DashboardOverview'

export default function AnalyticsSection() {
  const { analytics, orders } = useAdmin()

  const totalRevenue = analytics.revenue.reduce((s, v) => s + v, 0)
  const totalOrders = analytics.orders.reduce((s, v) => s + v, 0)
  const avgOrderValue = Math.round(totalRevenue / totalOrders)
  const conversionRate = '3.2%'

  return (
    <div>
      <SectionHeader title="Analytics" sub="Performance insights across the last 12 months" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Annual Revenue" value={`£${(totalRevenue / 1000).toFixed(0)}k`} accent="#c8f542" icon="£" />
        <StatCard label="Annual Orders" value={totalOrders} icon="◎" />
        <StatCard label="Avg. Order Value" value={`£${avgOrderValue}`} icon="◈" />
        <StatCard label="Conversion Rate" value={conversionRate} accent="#4ade80" icon="%" />
      </div>

      {/* Revenue & Orders charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 4px', fontWeight: 500 }}>Monthly Revenue</p>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#c8f542', margin: '0 0 20px' }}>£{totalRevenue.toLocaleString()}</p>
          <BarChart data={analytics.revenue} labels={analytics.months} color="#c8f542" prefix="£" height={140} />
        </div>
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 4px', fontWeight: 500 }}>Monthly Orders</p>
          <p style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic', color: '#f2ebdc', margin: '0 0 20px' }}>{totalOrders}</p>
          <BarChart data={analytics.orders} labels={analytics.months} color="#60a5fa" height={140} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top products */}
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Best Sellers</p>
          {analytics.topProducts.map((p, i) => (
            <div key={p.name} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#c8f542', width: 20, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.7)' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#4ade80' }}>£{p.revenue.toLocaleString()}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(242,235,220,0.07)' }}>
                  <div style={{ height: '100%', background: '#c8f542', width: `${(p.sold / analytics.topProducts[0].sold) * 100}%`, opacity: 0.7 - i * 0.1 }} />
                </div>
                <span style={{ fontSize: 9, color: 'rgba(242,235,220,0.3)', letterSpacing: '0.1em' }}>{p.sold} units sold</span>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic sources */}
        <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>Traffic Sources</p>
          {analytics.traffic.map((t, i) => (
            <div key={t.source} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.6)' }}>{t.source}</span>
                <span style={{ fontSize: 11, color: '#c8f542', fontWeight: 500 }}>{t.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(242,235,220,0.07)', position: 'relative' }}>
                <div style={{
                  height: '100%',
                  background: ['#c8f542', '#60a5fa', '#a78bfa', '#f87171', '#fbbf24'][i],
                  width: `${t.pct}%`,
                  opacity: 0.7,
                }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(242,235,220,0.07)' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 12px' }}>Orders by Country</p>
            {[
              { country: '🇬🇧 United Kingdom', pct: 61 },
              { country: '🇺🇸 United States', pct: 14 },
              { country: '🇬🇭 Ghana', pct: 9 },
              { country: '🇨🇦 Canada', pct: 8 },
              { country: '🌍 Other', pct: 8 },
            ].map(c => (
              <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.5)' }}>{c.country}</span>
                <span style={{ fontSize: 11, color: 'rgba(242,235,220,0.5)' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
