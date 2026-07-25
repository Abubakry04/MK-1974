import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import TiltCard from '../TiltCard'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function NewArrivals() {
  const { products, addToCart, toggleWishlist, isWishlisted, apiLoading } = useApp()
  const newProducts = [...products].reverse().slice(0, 4)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="new-arrivals"
      ref={ref}
      className="bg-surface2 py-20 px-8 md:px-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s cubic-bezier(.16,1,.3,1) 0.1s, transform 0.8s cubic-bezier(.16,1,.3,1) 0.1s',
      }}
    >
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

        {apiLoading || newProducts.length === 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin" />
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-dark/50">Loading Products...</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-dark/5 rounded-md mb-4 border border-dark/5" />
                  <div className="h-4 bg-dark/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-dark/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : newProducts.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm uppercase tracking-widest">
            No new arrivals found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map(p => {
              const mainImg = (p.images && p.images[0]) ? p.images[0] : '/product2.png'
              const priceFormatted = Number(p.price || 0).toLocaleString()
              return (
                <article key={p.id} className="group cursor-pointer active:scale-95 transition-transform duration-200">
                  <TiltCard maxRotation={10} scale={1.03} className="mb-4">
                    <div className="relative overflow-hidden aspect-[3/4] bg-surface2 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-black/5">
                      <Link to={`/product/${p.slug}`}>
                        <img src={mainImg} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      {p.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="text-[0.55rem] font-black tracking-[0.22em] uppercase text-white bg-lime px-2.5 py-1 rounded-sm shadow-sm">{p.badge}</span>
                        </div>
                      )}
                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 z-10 active:scale-125 shadow-sm ${isWishlisted(p.id) ? 'text-lime' : 'text-black/50 hover:text-black'}`}
                        aria-label="Wishlist"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                      {/* Quick Add */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button
                          onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')}
                          className="w-full bg-dark/95 backdrop-blur-sm text-cream text-[0.6rem] font-bold tracking-[0.25em] uppercase py-3.5 hover:bg-lime hover:text-black active:bg-lime active:text-black transition-colors duration-200"
                        >
                          Quick Add — ₦{priceFormatted}
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="text-[0.88rem] font-medium tracking-[0.03em] mb-1 group-hover:text-lime transition-colors" style={{ color: '#1A1A1A' }}>{p.name}</h3>
                    <p className="text-muted text-[0.72rem] mb-1.5">{p.colors?.[0]?.name || 'Standard'}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.88rem] font-bold" style={{ color: '#1A1A1A' }}>₦{priceFormatted}</span>
                      {p.originalPrice && <span className="text-muted text-[0.72rem] line-through">₦{Number(p.originalPrice).toLocaleString()}</span>}
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
