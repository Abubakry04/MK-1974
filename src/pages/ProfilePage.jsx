import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'profile', label: 'Personal info' },
  { id: 'settings', label: 'Settings' },
]

const STATUS_STYLES = {
  awaiting_payment: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  payment_confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
  processing: 'text-orange-600 bg-orange-50 border-orange-200',
  ready_for_delivery: 'text-purple-600 bg-purple-50 border-purple-200',
  delivered: 'text-green-600 bg-green-50 border-green-200',
}

const getOrderNum = (o) =>
  o.orderNumber || o.orderNo || (String(o.id).startsWith('MK') ? o.id : `MK-${String(o.id).padStart(6, '0')}`)

// ─── Overview ──────────────────────────────────────────────────────────────────
function OverviewTab({ user, orders, wishlist }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-1">
        Hey, {user?.firstName} 👋
      </h2>
      <p className="text-muted text-sm mb-8">Here's a summary of your account.</p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Total orders', value: orders.length },
          { label: 'Wishlist items', value: wishlist.length },
        ].map(stat => (
          <div key={stat.label} className="border border-black/10 bg-white p-6">
            <p className="text-3xl font-bold text-dark">{stat.value}</p>
            <p className="text-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {orders.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-dark uppercase tracking-wide mb-4">Recent orders</h3>
          <div className="space-y-2">
            {orders.slice(0, 3).map(order => (
              <Link
                key={order.id}
                to={`/order-tracking/${order.id}`}
                className="flex items-center justify-between border border-black/10 bg-white p-4 hover:border-accent/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-dark">Order #{getOrderNum(order)}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 border capitalize ${STATUS_STYLES[order.status] || 'text-muted'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-dark">₦{order.total.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-black/10 bg-white p-8 text-center">
          <p className="text-muted text-sm mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Shop now</Link>
        </div>
      )}
    </div>
  )
}

// ─── Orders ────────────────────────────────────────────────────────────────────
function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="border border-black/10 bg-white p-12 text-center">
        <p className="text-muted text-sm mb-4">No orders yet.</p>
        <Link to="/shop" className="btn-primary">Start shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Order history</h2>
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-dark">Order #{getOrderNum(order)}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 border capitalize ${STATUS_STYLES[order.status] || 'text-muted'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <Link to={`/order-tracking/${order.id}`} className="text-sm text-accent hover:text-dark transition-colors">
                  Track →
                </Link>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {order.items.slice(0, 4).map((item, i) => (
                <div key={i} className="w-12 aspect-[3/4] overflow-hidden bg-surface2">
                  <img src={item.product?.images?.[0] || ''} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="w-12 aspect-[3/4] bg-surface2 flex items-center justify-center">
                  <span className="text-muted text-xs">+{order.items.length - 4}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-black/[0.06] pt-3">
              <span className="text-xs text-muted">{order.items.reduce((s, i) => s + i.qty, 0)} items</span>
              <span className="text-sm font-semibold text-dark">₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────
function WishlistTab({ wishlist, toggleWishlist, addToCart, products }) {
  const wishlisted = products.filter(p => wishlist.includes(p.id))

  if (wishlisted.length === 0) {
    return (
      <div className="border border-black/10 bg-white p-12 text-center">
        <p className="text-muted text-sm mb-4">Your wishlist is empty.</p>
        <Link to="/shop" className="btn-primary">Browse collection</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Wishlist <span className="text-muted font-normal text-base">({wishlisted.length})</span></h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {wishlisted.map(p => (
          <div key={p.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface2 mb-3">
              <Link to={`/product/${p.slug}`}>
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <Link to={`/product/${p.slug}`}>
              <h3 className="text-sm font-medium text-dark hover:text-accent transition-colors">{p.name}</h3>
            </Link>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm text-dark font-semibold">₦{Number(p.price).toLocaleString()}</span>
              <button
                onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')}
                className="text-xs font-medium text-accent hover:text-dark transition-colors"
              >
                Add to bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Personal Info ─────────────────────────────────────────────────────────────
function ProfileInfoTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || user?.phone || '',
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Personal information</h2>
      <div className="max-w-md space-y-4">
        {[
          { name: 'firstName', label: 'First name' },
          { name: 'lastName', label: 'Last name' },
          { name: 'email', label: 'Email address', type: 'email' },
          { name: 'phone', label: 'Phone number', type: 'tel' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs text-muted mb-1.5">{f.label}</label>
            <input
              type={f.type || 'text'}
              name={f.name}
              value={form[f.name]}
              onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
              className="w-full bg-white border border-black/10 text-dark text-sm px-4 py-3 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        ))}
        <button onClick={() => onUpdate(form)} className="btn-primary">Save changes</button>
      </div>
    </div>
  )
}

// ─── Settings ──────────────────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-dark mb-6">Settings</h2>
      <div className="max-w-md space-y-3">
        {[
          { label: 'Email notifications', desc: 'Order updates and news via email' },
          { label: 'SMS notifications', desc: 'Order updates via text message' },
          { label: 'Marketing emails', desc: 'Early access, offers and new arrivals' },
        ].map(setting => (
          <div key={setting.label} className="flex items-center justify-between border border-black/10 bg-white p-4">
            <div>
              <p className="text-sm font-medium text-dark">{setting.label}</p>
              <p className="text-xs text-muted mt-0.5">{setting.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-black/10 peer-checked:bg-accent rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-transform peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
        <div className="pt-4 border-t border-black/[0.06]">
          <button className="text-red-500 text-sm hover:text-red-600 transition-colors">Delete account</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, orders, wishlist, toggleWishlist, addToCart, logout, showToast, products } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-surface flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-dark/50 text-sm mb-5">Sign in to view your account</p>
            <Link to="/auth" className="btn-primary">Sign in</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen pt-[70px]">
        {/* Page header */}
        <div className="bg-surface2 border-b border-black/[0.06] px-8 md:px-12 py-8">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark">{user.firstName} {user.lastName}</h1>
              <p className="text-muted text-sm mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-muted hover:text-dark transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 md:px-12 py-10 flex flex-col md:flex-row gap-10">
          {/* Sidebar nav */}
          <aside className="md:w-52 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  id={`profile-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`shrink-0 text-left px-4 py-2.5 text-sm font-medium transition-colors rounded ${
                    activeTab === item.id
                      ? 'bg-dark text-cream'
                      : 'text-dark/60 hover:text-dark hover:bg-black/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && <OverviewTab user={user} orders={orders} wishlist={wishlist} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} products={products} />}
            {activeTab === 'profile' && <ProfileInfoTab user={user} onUpdate={() => showToast('Profile updated.')} />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
