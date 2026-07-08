import { useAdmin } from './context/AdminContext'
import AdminSidebar from './components/AdminSidebar'
import AdminLogin from './components/AdminLogin'

// Sections
import DashboardOverview from './sections/DashboardOverview'
import ProductsSection from './sections/ProductsSection'
import CategoriesSection from './sections/CategoriesSection'
import InventorySection from './sections/InventorySection'
import OrdersSection from './sections/OrdersSection'
import CustomersSection from './sections/CustomersSection'
import ReviewsSection from './sections/ReviewsSection'
import PaymentsSection from './sections/PaymentsSection'
import DiscountsSection from './sections/DiscountsSection'
import ShippingSection from './sections/ShippingSection'
import AnalyticsSection from './sections/AnalyticsSection'
import StaffSection from './sections/StaffSection'
import SettingsSection from './sections/SettingsSection'

const SECTIONS = {
  dashboard:  DashboardOverview,
  products:   ProductsSection,
  categories: CategoriesSection,
  inventory:  InventorySection,
  orders:     OrdersSection,
  customers:  CustomersSection,
  reviews:    ReviewsSection,
  payments:   PaymentsSection,
  discounts:  DiscountsSection,
  shipping:   ShippingSection,
  analytics:  AnalyticsSection,
  staff:      StaffSection,
  settings:   SettingsSection,
}

export default function AdminLayout() {
  const { adminUser, activeSection } = useAdmin()

  if (!adminUser) return <AdminLogin />

  const ActiveSection = SECTIONS[activeSection] || DashboardOverview

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#2c2e35',
      fontFamily: "'Inter', sans-serif",
      color: '#f2ebdc',
    }}>
      <AdminSidebar />

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: 64,
          borderBottom: '1px solid rgba(242,235,220,0.06)',
          background: '#2c2e35',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.25)', fontWeight: 400 }}>MK 1974</span>
            <span style={{ color: 'rgba(242,235,220,0.15)' }}>›</span>
            <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.5)', fontWeight: 500, textTransform: 'capitalize' }}>{activeSection}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{
              fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,235,220,0.3)',
              textDecoration: 'none', fontWeight: 500,
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#c8f542'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(242,235,220,0.3)'}
            >↗ Storefront</a>
            <div style={{ width: 1, height: 16, background: 'rgba(242,235,220,0.1)' }} />
            <div style={{ display: 'flex', items: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: 'rgba(200,245,66,0.15)', border: '1px solid rgba(200,245,66,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#c8f542' }}>
                {adminUser?.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '40px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
