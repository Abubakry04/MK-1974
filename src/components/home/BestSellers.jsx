import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'

export default function BestSellers() {
  const { products, addToCart, toggleWishlist, isWishlisted } = useApp()
  // Map Best Sellers to the first 3 products from the API
  const bestSellers = products.slice(0, 3)

  if (bestSellers.length === 0) return null

  return (
    <section id="best-sellers" className="bg-surface2 py-20 px-8 md:px-12">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((p, i) => (
            <article key={p.id} className={`group cursor-pointer ${i === 1 ? 'md:-mt-8' : ''}`}>
              <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
                <Link to={`/product/${p.slug}`}>
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <div className="absolute top-4 left-4 flex gap-2">
                  {p.badge && <span className="text-[0.55rem] font-black tracking-[0.25em] uppercase text-white bg-lime px-2.5 py-1 rounded-sm">{p.badge}</span>}
                </div>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all z-10 ${isWishlisted(p.id) ? 'text-lime' : 'text-cream/40 hover:text-cream hover:scale-110'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                  <button
                    onClick={() => addToCart(p, p.sizes[2] || p.sizes[0], p.colors[0]?.name || 'Standard')}
                    className="w-full bg-dark/90 text-cream text-[0.6rem] font-semibold tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-white transition-colors duration-200"
                  >
                    Add to Bag — ₦{p.price}
                  </button>
                </div>
              </div>
              <Link to={`/product/${p.slug}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-black text-[0.88rem] font-medium mb-1 group-hover:text-lime transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(p.rating) ? '#968574' : 'none'} stroke="#968574" strokeWidth="1.5">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                      ))}
                      <span className="text-muted text-[0.65rem] ml-1">({p.reviews})</span>
                    </div>
                  </div>
                  <span className="text-lime font-medium text-[0.9rem]">₦{p.price}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
