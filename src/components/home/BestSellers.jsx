import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function BestSellers() {
  const { products, addToCart, toggleWishlist, isWishlisted, apiLoading } = useApp()
  const bestSellers = products.slice(0, 4)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="best-sellers"
      ref={ref}
      className="py-10 sm:py-14 px-4 sm:px-8 md:px-12 bg-surface2"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark">Bestsellers</h2>
          <Link to="/shop?sort=best-selling" className="text-xs sm:text-sm text-muted hover:text-dark transition-colors font-medium">
            View all →
          </Link>
        </div>

        {apiLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-dark/5 rounded mb-3" />
                <div className="h-4 bg-dark/8 rounded w-3/4 mb-2" />
                <div className="h-3 bg-dark/6 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : bestSellers.length === 0 ? (
          <p className="text-muted text-sm text-center py-10">No best sellers found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {bestSellers.map((p, i) => {
              const mainImg = (p.images && p.images[0]) ? p.images[0] : null
              const priceFormatted = Number(p.price || 0).toLocaleString()
              return (
                <article key={p.id} className="group">
                  <div className="relative overflow-hidden aspect-[3/4] bg-surface rounded mb-3">
                    <Link to={`/product/${p.slug}`} className="block w-full h-full">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface2 flex items-center justify-center p-4">
                          <span className="text-muted/40 font-bold text-xs uppercase tracking-wider">{p.name}</span>
                        </div>
                      )}
                    </Link>

                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-dark text-cream text-[0.6rem] font-semibold px-2.5 py-1">
                        {p.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm transition-colors duration-200 ${isWishlisted(p.id) ? 'text-red-500' : 'text-dark/40 hover:text-dark'}`}
                      aria-label="Save to wishlist"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>

                    <div className="absolute inset-x-0 bottom-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')}
                        className="w-full bg-dark text-cream text-xs font-semibold py-3 hover:bg-accent transition-colors duration-200"
                      >
                        Add to bag — ₦{priceFormatted}
                      </button>
                    </div>
                  </div>

                  <Link to={`/product/${p.slug}`}>
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold text-dark hover:text-accent transition-colors">{p.name}</h3>
                      <span className="text-sm font-semibold text-dark ml-3 shrink-0">₦{priceFormatted}</span>
                    </div>
                    {p.colors?.length > 0 && (
                      <p className="text-sm text-muted mt-0.5">{p.colors.length} colours</p>
                    )}
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
