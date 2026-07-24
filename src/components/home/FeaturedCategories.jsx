import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import TiltCard from '../TiltCard'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function FeaturedCategories() {
  const { categories, apiLoading } = useApp()
  const [showAll, setShowAll] = useState(false)
  const { ref, isVisible } = useScrollReveal()

  // Filter out 'All' for the featured categories grid
  const cats = categories
    .filter(c => c.toLowerCase() !== 'all')
    .map((name, i) => {
      const images = ['/product2.png', '/product1.png', '/hero.png', '/product3.png']
      return {
        label: name,
        image: images[i % images.length],
        to: `/shop?category=${name.toLowerCase()}`
      }
    })

  const displayedCats = showAll ? cats : cats.slice(0, 4)

  return (
    <section
      ref={ref}
      className="bg-surface2 py-20 px-8 md:px-12"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Browse By</p>
          <h2 className="font-playfair font-black italic" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#1A1A1A' }}>Featured Categories</h2>
        </div>

        {apiLoading || cats.length === 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin" />
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-dark/50">Loading Categories...</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-dark/5 animate-pulse rounded-md p-4 flex flex-col justify-end border border-dark/5 relative overflow-hidden">
                  <div className="h-10 bg-dark/10 rounded w-3/4 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayedCats.map(cat => (
                <TiltCard key={cat.label} maxRotation={12} scale={1.04} className="h-full">
                  <Link to={cat.to} id={`cat-${cat.label.toLowerCase()}`} className="group relative aspect-[3/4] overflow-hidden bg-surface2 block rounded-md shadow-sm hover:shadow-xl transition-shadow h-full">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-x-4 bottom-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 rounded-sm">
                      <p className="text-cream text-[0.75rem] font-semibold tracking-[0.25em] uppercase text-center">{cat.label}</p>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
            {cats.length > 4 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-3 border border-dark/20 text-black/40 px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:border-lime hover:text-black rounded-sm"
                >
                  {showAll ? 'Show Less' : `+ View All Categories (${cats.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
