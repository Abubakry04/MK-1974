import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'

export default function FeaturedCategories() {
  const { categories } = useApp()
  const [showAll, setShowAll] = useState(false)

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

  if (cats.length === 0) return null

  const displayedCats = showAll ? cats : cats.slice(0, 4)

  return (
    <section className="bg-surface2 py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Browse By</p>
          <h2 className="font-playfair font-black italic" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#1A1A1A' }}>Featured Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedCats.map(cat => (
            <Link key={cat.label} to={cat.to} id={`cat-${cat.label.toLowerCase()}`} className="group relative aspect-[3/4] overflow-hidden bg-surface2 block rounded-md shadow-sm hover:shadow-md transition-shadow">
              <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-4 bottom-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 rounded-sm">
                <p className="text-cream text-[0.75rem] font-semibold tracking-[0.25em] uppercase text-center">{cat.label}</p>
              </div>
            </Link>
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
      </div>
    </section>
  )
}
