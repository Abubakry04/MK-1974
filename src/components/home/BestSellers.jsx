import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import TiltCard from '../TiltCard'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function BestSellers() {
  const { products, addToCart, toggleWishlist, isWishlisted, apiLoading } = useApp()
  const bestSellers = products.slice(0, 3)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="best-sellers"
      ref={ref}
      className="bg-surface2 py-20 px-8 md:px-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s cubic-bezier(.16,1,.3,1) 0.2s, transform 0.8s cubic-bezier(.16,1,.3,1) 0.2s',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Fan Favourites</p>
            <h2 className="font-playfair font-black italic text-black" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Best Sellers</h2>
          </div>
          <Link to="/shop?sort=best-selling" className="btn-text text-black/60 hover:text-lime group">
            View All
            <svg className="transform transition-transform group-hover:translate-x-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {apiLoading || bestSellers.length === 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin" />
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-dark/50">Loading Best Sellers...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-dark/5 rounded-md mb-4 border border-dark/5" />
                  <div className="h-4 bg-dark/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-dark/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : bestSellers.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm uppercase tracking-widest">
            No best sellers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {bestSellers.map((p, i) => {
              const mainImg = (p.images && p.images[0]) ? p.images[0] : '/product1.png'
              const priceFormatted = Number(p.price || 0).toLocaleString()
              return (
                <article key={p.id} className={`group cursor-pointer active:scale-95 transition-transform duration-200 ${i === 1 ? 'md:-mt-6' : ''}`}>
                  <TiltCard maxRotation={10} scale={1.03} className="mb-4">
                    <div className="relative overflow-hidden aspect-[3/4] bg-surface2 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-black/5">
                      <Link to={`/product/${p.slug}`}>
                        <img src={mainImg} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <div className="absolute top-4 left-4 flex gap-2">
                        {p.badge && <span className="text-[0.55rem] font-black tracking-[0.25em] uppercase text-white bg-lime px-2.5 py-1 rounded-sm shadow-sm">{p.badge}</span>}
                      </div>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-all z-10 active:scale-125 shadow-sm ${isWishlisted(p.id) ? 'text-lime' : 'text-black/50 hover:text-black'}`}
                        aria-label="Wishlist"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                      <div className="absolute inset-x-0 bottom-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button
                          onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')}
                          className="w-full bg-dark/95 backdrop-blur-sm text-cream text-[0.6rem] font-bold tracking-[0.25em] uppercase py-3.5 hover:bg-lime hover:text-black active:bg-lime active:text-black transition-colors duration-200"
                        >
                          Add to Bag — ₦{priceFormatted}
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                  <Link to={`/product/${p.slug}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-black text-[0.88rem] font-bold mb-1 group-hover:text-lime transition-colors">{p.name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, idx) => (
                            <svg key={idx} width="10" height="10" viewBox="0 0 24 24" fill={idx < Math.floor(p.rating || 5) ? '#968574' : 'none'} stroke="#968574" strokeWidth="1.5">
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                            </svg>
                          ))}
                          <span className="text-muted text-[0.65rem] ml-1">({p.reviews || 0})</span>
                        </div>
                      </div>
                      <span className="text-lime font-black text-[0.92rem]">₦{priceFormatted}</span>
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
