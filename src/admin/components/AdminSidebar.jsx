import { useAdmin } from '../context/AdminContext'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: '◈' },
  { id: 'products',   label: 'Products',     icon: '▦' },
  { id: 'categories', label: 'Categories',   icon: '⊞' },
  { id: 'inventory',  label: 'Inventory',    icon: '⬡' },
  { id: 'orders',     label: 'Orders',       icon: '◎' },
  { id: 'customers',  label: 'Customers',    icon: '◈' },
  { id: 'reviews',    label: 'Reviews',      icon: '★' },
  { id: 'payments',   label: 'Payments',     icon: '◇' },
  // { id: 'discounts',  label: 'Discounts',    icon: '%' },
  // { id: 'shipping',   label: 'Shipping',     icon: '⬢' },
  { id: 'analytics',  label: 'Analytics',    icon: '▲' },
  { id: 'staff',      label: 'Staff',        icon: '⊕' },
  { id: 'settings',   label: 'Settings',     icon: '⚙' },
]

export default function AdminSidebar() {
  const { activeSection, setActiveSection, adminUser, adminLogout, sidebarCollapsed, setSidebarCollapsed, stats } = useAdmin()

  const badgeCounts = {
    orders: stats.pendingOrders,
    reviews: stats.pendingReviews,
  }

  return (
    <aside style={{
      width: sidebarCollapsed ? 68 : 240,
      minHeight: '100vh',
      background: '#1f2127',
      borderRight: '1px solid rgba(242,235,220,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: sidebarCollapsed ? '20px 0' : '20px 20px',
        borderBottom: '1px solid rgba(242,235,220,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        minHeight: 72,
      }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#c8f542', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 13, color: '#080808', fontStyle: 'italic' }}>MK</span>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8f542', margin: 0, fontWeight: 500, lineHeight: 1.2 }}>1974</p>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)', margin: 0, fontWeight: 300, lineHeight: 1.2 }}>Admin</p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{ width: 32, height: 32, background: '#c8f542', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 13, color: '#080808', fontStyle: 'italic' }}>MK</span>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            id="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.3)', fontSize: 16, padding: 4, lineHeight: 1 }}
          >‹</button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.3)', fontSize: 16, padding: '8px 0', lineHeight: 1, textAlign: 'center' }}
        >›</button>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id
          const badge = badgeCounts[item.id]
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '11px 0' : '11px 20px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(200,245,66,0.08)' : 'none',
                borderLeft: isActive ? '2px solid #c8f542' : '2px solid transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid #c8f542' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(242,235,220,0.03)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
            >
              <span style={{ fontSize: 14, color: isActive ? '#c8f542' : 'rgba(242,235,220,0.4)', flexShrink: 0, width: 18, textAlign: 'center' }}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ fontSize: 12, fontWeight: isActive ? 500 : 300, color: isActive ? '#f2ebdc' : 'rgba(242,235,220,0.5)', letterSpacing: '0.05em' }}>
                    {item.label}
                  </span>
                  {badge > 0 && (
                    <span style={{
                      marginLeft: 'auto', background: '#c8f542', color: '#080808',
                      fontSize: 9, fontWeight: 700, padding: '2px 6px',
                      borderRadius: 0, letterSpacing: '0.05em', minWidth: 18, textAlign: 'center',
                    }}>{badge}</span>
                  )}
                </>
              )}
              {sidebarCollapsed && badge > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 8,
                  width: 8, height: 8, background: '#c8f542', borderRadius: '50%',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div style={{
        padding: sidebarCollapsed ? '16px 0' : '16px 20px',
        borderTop: '1px solid rgba(242,235,220,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      }}>
        <div style={{ width: 32, height: 32, background: 'rgba(200,245,66,0.15)', border: '1px solid rgba(200,245,66,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#c8f542', letterSpacing: '0.05em' }}>{adminUser?.avatar || 'MK'}</span>
        </div>
        {!sidebarCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#f2ebdc', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminUser?.name}</p>
            <p style={{ fontSize: 9, color: 'rgba(242,235,220,0.3)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{adminUser?.role}</p>
          </div>
        )}
        {!sidebarCollapsed && (
          <button
            id="admin-logout-btn"
            onClick={adminLogout}
            title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,235,220,0.3)', fontSize: 14, padding: 4, flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,235,220,0.3)'}
          >Sign Out</button>
        )}
      </div>
    </aside>
  )
}
