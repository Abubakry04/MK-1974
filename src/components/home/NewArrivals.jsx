import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'

export default function NewArrivals() {
  const { products, addToCart, toggleWishlist, isWishlisted } = useApp()
  // Map New Arrivals to the 4 most recently created products from the API
  const newProducts = [...products].reverse().slice(0, 4)

  if (newProducts.length === 0) return null

  return (
    <section id="new-arrivals" className="bg-surface2 py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Just Dropped</p>
            <h2 className="font-playfair font-black italic" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#1A1A1A' }}>New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="btn-text hover:text-lime group" style={{ color: '#1A1A1A' }}>
            View All New Arrivals
            <svg className="transform transition-transform group-hover:translate-x-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {newProducts.map(p => (
            <article key={p.id} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4 rounded-md">
                <Link to={`/product/${p.slug}`}>
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                {p.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[0.55rem] font-semibold tracking-[0.25em] uppercase text-white bg-lime px-2.5 py-1 rounded-sm shadow-sm">{p.badge}</span>
                  </div>
                )}
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 z-10 ${isWishlisted(p.id) ? 'text-lime' : 'text-cream/40 hover:text-cream hover:scale-110'}`}
                  aria-label="Wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                {/* Quick Add */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <button
                    onClick={() => addToCart(p, p.sizes[2] || p.sizes[0], p.colors[0]?.name || 'Standard')}
                    className="w-full bg-dark/90 backdrop-blur-sm text-cream text-[0.6rem] font-semibold tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-white transition-colors duration-200"
                  >
                    Quick Add — ₦{p.price}
                  </button>
                </div>
              </div>
              <Link to={`/product/${p.slug}`}>
                <h3 className="text-[0.85rem] font-medium tracking-[0.04em] mb-1 group-hover:text-lime transition-colors" style={{ color: '#1A1A1A' }}>{p.name}</h3>
                <p className="text-muted text-[0.72rem] mb-2">{p.colors[0]?.name || 'Standard'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[0.85rem] font-medium" style={{ color: '#1A1A1A' }}>₦{p.price}</span>
                  {p.originalPrice && <span className="text-muted text-[0.72rem] line-through">₦{p.originalPrice}</span>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
