import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

function RatingStars({ rating }) {
  const score = Number(rating || 4.5)
  const fullStars = Math.floor(score)
  const hasHalfStar = (score % 1) >= 0.3

  return (
    <div className="flex items-center gap-1 my-1">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )
          } else if (i === fullStars && hasHalfStar) {
            return (
              <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`star-half-bs-${i}`}>
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
                <path fill={`url(#star-half-bs-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )
          } else {
            return (
              <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gray-200 text-gray-200" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )
          }
        })}
      </div>
      <span className="text-[0.7rem] sm:text-xs font-normal text-neutral-500 ml-1">
        {score.toFixed(1)}/<span className="text-neutral-400">5</span>
      </span>
    </div>
  )
}

export default function BestSellers() {
  const { products, addToCart, toggleWishlist, isWishlisted, apiLoading } = useApp()
  const bestSellers = products.slice(0, 4)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="best-sellers"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 bg-white border-t border-gray-100"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-black text-center tracking-tight mb-8 sm:mb-14 font-sans">
          TOP SELLING
        </h2>

        {apiLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-[#F0EEED] rounded-2xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : bestSellers.length === 0 ? (
          <p className="text-muted text-sm text-center py-10">No best sellers found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map(p => {
              const mainImg = (p.images && p.images[0]) ? p.images[0] : null
              const priceNum = Number(p.price || 0)
              const originalPriceNum = Number(p.originalPrice || 0)
              const priceFormatted = priceNum.toLocaleString()
              const originalPriceFormatted = originalPriceNum > priceNum ? originalPriceNum.toLocaleString() : null
              const discountPercent = (originalPriceNum > priceNum) 
                ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
                : null

              return (
                <article key={p.id} className="group w-full flex flex-col">
                  {/* Soft Light-Gray Container */}
                  <div className="relative overflow-hidden aspect-square sm:aspect-[4/5] bg-[#F0EEED] rounded-2xl p-2 sm:p-4 flex items-center justify-center">
                    <Link to={`/product/${p.slug}`} className="block w-full h-full">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EAEAE8] rounded-xl flex items-center justify-center p-4">
                          <span className="text-black/30 font-bold text-xs uppercase tracking-wider">{p.name}</span>
                        </div>
                      )}
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-sm transition-all duration-200 ${
                        isWishlisted(p.id) ? 'text-red-500 scale-110' : 'text-black/40 hover:text-black hover:bg-white'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')}
                        className="w-full bg-black text-white text-xs font-semibold py-3 hover:bg-neutral-800 transition-colors duration-200"
                      >
                        Add to bag — ₦{priceFormatted}
                      </button>
                    </div>
                  </div>

                  {/* Details below */}
                  <div className="mt-3 flex flex-col flex-1">
                    <Link to={`/product/${p.slug}`} className="block group-hover:text-neutral-700 transition-colors">
                      <h3 className="text-sm sm:text-base font-bold text-black truncate tracking-tight">{p.name}</h3>
                    </Link>

                    {/* Star Rating */}
                    <RatingStars rating={p.rating || 4.8} />

                    {/* Price Row */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base sm:text-lg font-bold text-black">₦{priceFormatted}</span>
                      {originalPriceFormatted && (
                        <span className="text-sm sm:text-base font-bold text-neutral-400 line-through">
                          ₦{originalPriceFormatted}
                        </span>
                      )}
                      {discountPercent && discountPercent > 0 && (
                        <span className="bg-red-100 text-red-500 font-medium text-[0.65rem] sm:text-xs rounded-full px-2 py-0.5">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Centered View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/shop?sort=best-selling"
            className="inline-block w-full sm:w-auto text-center border border-black/10 hover:border-black hover:bg-black hover:text-white text-black font-medium text-sm rounded-full px-14 py-3.5 transition-all duration-300"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}
