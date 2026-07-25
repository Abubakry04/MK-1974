import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function MobileBottomNav() {
  const { cartCount, setCartOpen, wishlist, user } = useApp()
  const location = useLocation()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      to: '/',
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'shop',
      label: 'Shop',
      to: '/shop',
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      to: user ? '/profile' : '/auth',
      badge: wishlist.length,
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 'bag',
      label: 'Bag',
      action: () => setCartOpen(true),
      badge: cartCount,
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
  ]

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-[90] pointer-events-auto">
      <div className="bg-dark/85 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.to ? location.pathname === item.to : false

          const content = (
            <div className="relative flex flex-col items-center gap-1 group">
              <div
                className={`p-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'text-lime scale-110' : 'text-cream/50 group-active:scale-90 group-active:text-cream'
                }`}
              >
                {item.icon(isActive)}
              </div>
              <span
                className={`text-[0.52rem] font-bold tracking-[0.2em] uppercase transition-colors ${
                  isActive ? 'text-lime' : 'text-cream/40'
                }`}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime text-black font-black text-[0.45rem] min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {item.badge}
                </span>
              )}
            </div>
          )

          if (item.action) {
            return (
              <button key={item.id} onClick={item.action} aria-label={item.label} className="focus:outline-none">
                {content}
              </button>
            )
          }

          return (
            <Link key={item.id} to={item.to} aria-label={item.label}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
