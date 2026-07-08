import { useAdmin } from '../context/AdminContext'
import { SectionHeader, AdminBtn, StatCard } from './DashboardOverview'

export default function InventorySection() {
  const { products, apiLoading, fetchAllApiData } = useAdmin()

  const inStock = products.filter(p => p.stockQuantity > 0).length
  const outOfStock = products.filter(p => p.stockQuantity === 0).length
  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length
  const totalVariantSkus = products.reduce((s, p) => s + (p.variants?.length || 0), 0)

  return (
    <div>
      <SectionHeader
        title="Inventory"
        sub={apiLoading ? 'Loading from API…' : 'Stock levels from live API'}
        action={<AdminBtn variant="ghost" onClick={fetchAllApiData} id="refresh-inventory-btn">↻ Refresh</AdminBtn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="In Stock" value={inStock} accent="#4ade80" icon="✓" />
        <StatCard label="Out of Stock" value={outOfStock} accent="#f87171" icon="✕" />
        <StatCard label="Low Stock" value={lowStock} sub="< 10 units" accent="#fbbf24" icon="⚠" />
        <StatCard label="Total Variants" value={totalVariantSkus} sub="Across all products" icon="◈" />
      </div>

      {/* Stock table */}
      <div style={{ background: 'rgba(242,235,220,0.02)', border: '1px solid rgba(242,235,220,0.07)', padding: 28 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', margin: '0 0 20px', fontWeight: 500 }}>
          Stock Status by Product
        </p>
        {apiLoading && products.length === 0 ? (
          <p style={{ color: 'rgba(242,235,220,0.3)', fontSize: 12 }}>Loading inventory data…</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(242,235,220,0.08)' }}>
                  {['Product', 'ID', 'Categories', 'Variants', 'Stock Qty', 'Level'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.35)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const qty = p.stockQuantity ?? 0
                  const level = qty === 0 ? 'out' : qty < 10 ? 'low' : 'ok'
                  const maxQty = Math.max(...products.map(x => x.stockQuantity ?? 0), 1)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(242,235,220,0.04)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,235,220,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <td style={{ padding: '14px 16px', color: '#f2ebdc', fontWeight: 400 }}>{p.name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.4)', fontFamily: 'monospace', fontSize: 11 }}>{p.id}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.5)', fontSize: 11 }}>
                        {(p.categories || []).map(c => c.name).join(', ') || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(242,235,220,0.5)' }}>
                        {p.variants?.length ?? 0}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 500, color: level === 'out' ? '#f87171' : level === 'low' ? '#fbbf24' : '#4ade80' }}>
                        {qty}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ height: 4, width: 80, background: 'rgba(242,235,220,0.08)' }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min((qty / maxQty) * 100, 100)}%`,
                            background: level === 'out' ? '#f87171' : level === 'low' ? '#fbbf24' : '#c8f542',
                          }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(242,235,220,0.3)', fontSize: 12 }}>No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
