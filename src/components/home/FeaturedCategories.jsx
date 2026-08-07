import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function FeaturedCategories() {
  const { categories, apiLoading } = useApp()
  const { ref, isVisible } = useScrollReveal()

  const cats = categories
    .map(c => typeof c === 'string' ? c : (c?.name || String(c?.id || '')))
    .filter(name => name && name.toLowerCase() !== 'all')
    .map((name, i) => {
      const images = ['/product2.png', '/product1.png', '/lifestyle.png', '/product3.png']
      return {
        label: name,
        image: images[i % images.length],
        to: `/shop?category=${encodeURIComponent(name.toLowerCase())}`
      }
    })

  return (
    <section
      ref={ref}
      className="py-16 px-8 md:px-12 bg-surface2"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark">Shop by category</h2>
          <Link to="/shop" className="text-sm text-muted hover:text-dark transition-colors">
            View all →
          </Link>
        </div>

        {apiLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-dark/5 animate-pulse rounded" />
            ))}
          </div>
        ) : cats.length === 0 ? (
          <p className="text-muted text-sm text-center py-10">No categories available.</p>
        ) : (
          // Asymmetric layout: big card left + 3 smaller on right
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Big card — takes 2 rows on md */}
            {cats[0] && (
              <Link
                to={cats[0].to}
                id={`cat-${cats[0].label.toLowerCase()}`}
                className="group relative overflow-hidden bg-dark rounded col-span-1 md:col-span-2 md:row-span-2 aspect-[3/4] md:aspect-auto"
              >
                <img
                  src={cats[0].image}
                  alt={cats[0].label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-white font-bold text-xl">{cats[0].label}</p>
                  <p className="text-cream/60 text-sm mt-1 group-hover:text-cream/90 transition-colors">Shop now →</p>
                </div>
              </Link>
            )}

            {/* 3 smaller cards */}
            {cats.slice(1, 4).map(cat => (
              <Link
                key={cat.label}
                to={cat.to}
                id={`cat-${cat.label.toLowerCase()}`}
                className="group relative overflow-hidden bg-dark rounded aspect-square"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-semibold text-base">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
