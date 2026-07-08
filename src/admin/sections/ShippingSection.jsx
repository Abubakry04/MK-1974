import { SectionHeader, StatCard, AdminBtn } from './DashboardOverview'

const ZONES = [
  { id: 'uk', name: 'United Kingdom', countries: 'England, Scotland, Wales, N. Ireland', rate: 'Free over £75 · £3.99 standard · £5.99 express', time: '2–4 days · 1–2 days express' },
  { id: 'eu', name: 'European Union', countries: '27 EU member states', rate: '£8.99 standard · £14.99 express', time: '4–7 days · 2–3 days express' },
  { id: 'us-ca', name: 'USA & Canada', countries: 'United States, Canada', rate: '£12.99 standard · £22.99 express', time: '7–12 days · 3–5 days express' },
  { id: 'row', name: 'Rest of World', countries: 'All other countries', rate: '£15.99 standard · £29.99 express', time: '10–21 days · 5–8 days express' },
]

const COURIERS = [
  { name: 'Royal Mail', service: 'Tracked 48 / Tracked 24', zone: 'UK', status: 'active' },
  { name: 'DPD', service: 'Next Day / Express', zone: 'UK, EU', status: 'active' },
  { name: 'DHL', service: 'International Express', zone: 'Global', status: 'active' },
  { name: 'FedEx', service: 'Economy / Priority', zone: 'USA, Canada', status: 'active' },
]

export default function ShippingSection() {
  return (
    <div>
      <SectionHeader title="Shipping" sub="Shipping zones, rates and courier integrations" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Active Zones" value={ZONES.length} accent="#c8f542" icon="⬢" />
        <StatCard label="Couriers" value={COURIERS.length} icon="◎" />
        <StatCard label="Avg. Delivery" value="3.2d" sub="UK standard" icon="⏱" />
        <StatCard label="Free Threshold" value="£75" sub="UK orders" icon="★" />
      </div>

      {/* Shipping Zones */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: 0, fontWeight: 500 }}>Shipping Zones</p>
          <AdminBtn variant="primary" id="add-zone-btn">+ Add Zone</AdminBtn>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ZONES.map(z => (
            <div key={z.id} style={{
              background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
              padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 20, alignItems: 'center',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,245,66,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(242,235,220,0.07)'}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#f2ebdc', margin: '0 0 3px' }}>{z.name}</p>
                <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.35)', margin: 0 }}>{z.countries}</p>
              </div>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 4px' }}>Rates</p>
                <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.6)', margin: 0, fontWeight: 300 }}>{z.rate}</p>
              </div>
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: '0 0 4px' }}>Delivery Time</p>
                <p style={{ fontSize: 11, color: 'rgba(242,235,220,0.6)', margin: 0, fontWeight: 300 }}>{z.time}</p>
              </div>
              <AdminBtn variant="ghost" id={`edit-zone-${z.id}`}>Edit</AdminBtn>
            </div>
          ))}
        </div>
      </div>

      {/* Couriers */}
      <div>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 16px', fontWeight: 500 }}>Active Couriers</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {COURIERS.map(c => (
            <div key={c.name} style={{
              background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)',
              padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#f2ebdc', margin: 0 }}>{c.name}</p>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '3px 8px' }}>Active</span>
              </div>
              <p style={{ fontSize: 10, color: 'rgba(242,235,220,0.4)', margin: '0 0 4px' }}>{c.service}</p>
              <p style={{ fontSize: 9, color: 'rgba(242,235,220,0.25)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.zone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
