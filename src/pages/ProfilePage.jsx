import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PRODUCTS } from '../data/products'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'orders', label: 'Orders', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const ORDER_STATUS_COLORS = {
  awaiting_payment: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  payment_confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  ready_for_delivery: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-lime bg-lime/10 border-lime/20',
}

function OverviewTab({ user, orders, wishlist }) {
  return (
    <div>
      <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Welcome back, {user?.firstName}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-lime' },
          { label: 'Wishlist Items', value: wishlist.length, color: 'text-blue-400' },
          // { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025', color: 'text-cream' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-white/[0.06] p-6">
            <p className="text-muted text-[0.68rem] tracking-[0.25em] uppercase mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <h3 className="text-cream font-semibold text-[0.8rem] tracking-[0.25em] uppercase mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <Link key={order.id} to={`/order-tracking/${order.id}`} className="flex items-center justify-between bg-surface border border-white/[0.06] p-4 hover:border-white/20 transition-all">
                <div>
                  <p className="text-cream font-medium text-[0.85rem]">Order #{order.id}</p>
                  <p className="text-muted text-[0.72rem]">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[0.6rem] font-semibold tracking-[0.2em] uppercase px-3 py-1 border ${ORDER_STATUS_COLORS[order.status] || 'text-muted'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lime font-semibold">£{order.total.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-cream/30 text-[0.85rem] tracking-[0.2em] uppercase mb-6">No orders yet</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Order History</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-surface border border-white/[0.06] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-cream font-semibold text-[0.9rem]">Order #{order.id}</p>
                <p className="text-muted text-[0.72rem]">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[0.6rem] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border ${ORDER_STATUS_COLORS[order.status] || 'text-muted'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <Link to={`/order-tracking/${order.id}`} className="text-lime text-[0.7rem] tracking-[0.15em] uppercase hover:text-lime-dim transition-colors">
                  Track →
                </Link>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              {order.items.slice(0, 3).map(item => (
                <div key={item.key} className="w-14 h-18 aspect-[3/4] overflow-hidden bg-surface2">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-14 aspect-[3/4] bg-surface2 flex items-center justify-center">
                  <span className="text-muted text-[0.72rem]">+{order.items.length - 3}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-white/[0.05] pt-4">
              <span className="text-muted text-[0.75rem]">{order.items.reduce((s, i) => s + i.qty, 0)} items</span>
              <span className="text-cream font-semibold">£{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WishlistTab({ wishlist, toggleWishlist, addToCart }) {
  const wishlisted = PRODUCTS.filter(p => wishlist.includes(p.id))

  if (wishlisted.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-cream/30 text-[0.85rem] tracking-[0.2em] uppercase mb-6">Your wishlist is empty</p>
        <Link to="/shop" className="btn-primary">Browse Collection</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {wishlisted.map(p => (
          <div key={p.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface2 mb-3">
              <Link to={`/product/${p.slug}`}>
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <button onClick={() => toggleWishlist(p.id)} className="absolute top-3 right-3 w-8 h-8 bg-dark/70 flex items-center justify-center text-lime">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            <Link to={`/product/${p.slug}`}>
              <h3 className="text-cream text-[0.82rem] font-medium mb-1">{p.name}</h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-cream/60 text-[0.8rem]">£{p.price}</span>
              <button onClick={() => addToCart(p, p.sizes[2] || p.sizes[0], p.colors[0].name)} className="text-[0.65rem] tracking-[0.2em] uppercase text-lime hover:text-lime-dim transition-colors">
                Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileTab({ user, onUpdate }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  return (
    <div>
      <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Personal Information</h2>
      <div className="max-w-lg space-y-5">
        {[
          { name: 'firstName', label: 'First Name' },
          { name: 'lastName', label: 'Last Name' },
          { name: 'email', label: 'Email Address', type: 'email' },
          { name: 'phone', label: 'Phone Number', type: 'tel' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">{f.label}</label>
            <input
              type={f.type || 'text'}
              name={f.name}
              value={form[f.name]}
              onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
              className="w-full bg-surface border border-white/10 text-cream text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 transition-colors"
            />
          </div>
        ))}
        <button onClick={() => onUpdate(form)} className="btn-primary">Save Changes</button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, orders, wishlist, toggleWishlist, addToCart, logout, showToast } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-cream/40 text-[0.85rem] tracking-[0.2em] uppercase mb-6">Please sign in to view your profile</p>
            <Link to="/auth" className="btn-primary">Sign In</Link>
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
      <main className="bg-dark min-h-screen pt-24 px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto py-12 flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <div className="bg-surface border border-white/[0.06] p-6 mb-4">
              <div className="w-14 h-14 bg-lime flex items-center justify-center text-dark font-black text-xl mb-4">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <p className="text-cream font-semibold text-[0.9rem]">{user.firstName} {user.lastName}</p>
              <p className="text-muted text-[0.75rem]">{user.email}</p>
            </div>

            <nav className="bg-surface border border-white/[0.06]">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  id={`profile-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-[0.78rem] font-medium tracking-[0.1em] border-l-2 transition-all ${
                    activeTab === item.id ? 'border-lime text-lime bg-lime/5' : 'border-transparent text-cream/60 hover:text-cream hover:bg-white/[0.02]'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-[0.78rem] font-medium tracking-[0.1em] text-red-400/70 hover:text-red-400 transition-colors border-t border-white/[0.05]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewTab user={user} orders={orders} wishlist={wishlist} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} />}
            {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />}
            {activeTab === 'profile' && <ProfileTab user={user} onUpdate={() => showToast('Profile updated!')} />}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Settings</h2>
                <div className="space-y-6 max-w-lg">
                  {[
                    { label: 'Email Notifications', desc: 'Receive order updates and news via email' },
                    { label: 'SMS Notifications', desc: 'Receive order updates via text message' },
                    { label: 'Marketing Emails', desc: 'Receive exclusive offers and new arrival alerts' },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-surface border border-white/[0.06]">
                      <div>
                        <p className="text-cream text-[0.85rem] font-medium">{setting.label}</p>
                        <p className="text-muted text-[0.72rem]">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-surface2 peer-checked:bg-lime rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-dark after:rounded-full after:w-4 after:h-4 after:transition-transform peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/[0.05]">
                    <button className="text-red-400/70 text-[0.72rem] tracking-[0.2em] uppercase hover:text-red-400 transition-colors">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-playfair font-black italic text-cream text-3xl mb-8">Saved Addresses</h2>
                <div className="text-center py-16">
                  <p className="text-cream/30 text-[0.85rem] tracking-[0.2em] uppercase mb-6">No saved addresses yet</p>
                  <button className="btn-ghost">Add New Address</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
