import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function ProductCard({ product }) {
  const { addToCart } = useApp()
  const firstColor = product.colors[0]?.name || 'Standard'

  return (
    <article id={product.id} className="group cursor-pointer">
      <Link to={`/product/${product.slug}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-surface2 rounded mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="text-[0.58rem] font-bold tracking-[0.25em] uppercase text-white bg-dark px-3 py-1 rounded-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Add to bag overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product, product.sizes[0] || 'M', firstColor) }}
            className="w-full bg-dark/90 backdrop-blur-sm text-cream text-[0.65rem] font-bold tracking-[0.25em] uppercase py-4 hover:bg-dark transition-colors duration-200"
          >
            Add to Bag — ₦{product.price.toLocaleString()}
          </button>
        </div>
      </div>

      </Link>
      {/* Info */}
      <Link to={`/product/${product.slug}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-dark text-[0.92rem] font-bold tracking-[0.02em]">{product.name}</h3>
            <p className="text-dark/50 text-[0.75rem] mt-0.5 font-medium">{firstColor}</p>
          </div>
          <span className="text-dark text-[0.92rem] font-bold">₦{product.price.toLocaleString()}</span>
        </div>
      </Link>
    </article>
  )
}

export default function Collection() {
  const { products, categories: appCats, apiLoading } = useApp()
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { label: 'All', value: 'all' },
    ...appCats.filter(c => c.toLowerCase() !== 'all').map(name => ({
      label: name,
      value: name.toLowerCase()
    }))
  ]

  const visible = products.filter(p => {
    if (activeFilter === 'all') return true
    return (p.categories || []).some(c => c.name.toLowerCase() === activeFilter.toLowerCase())
  })

  return (
    <section id="collection" className="bg-surface py-24 md:py-32 px-8 md:px-12 border-t border-black/10">
      <div className="max-w-[1440px] mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-3">The Range</p>
            <h2 className="font-playfair font-black italic text-dark" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
              Shop Collection
            </h2>
          </div>

          {/* Filters */}
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button
                key={f.value}
                id={`filter-${f.value}`}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-2 text-[0.62rem] font-bold tracking-[0.25em] uppercase transition-all duration-200 rounded
                  ${activeFilter === f.value
                    ? 'bg-dark text-cream'
                    : 'text-dark/60 hover:text-dark border border-black/15 hover:border-black'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {apiLoading ? (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-dark/50">Loading Collection...</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-stone-200 rounded-md mb-4" />
                  <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : visible.length > 0 ? (
          <div id="productsGrid" className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {visible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(26,26,26,0.4)', fontSize: 13 }}>
            No products found in this category.
          </div>
        )}

        {/* View all CTA */}
        <div className="mt-20 flex justify-center">
          <Link to="/shop" className="btn-ghost">
            View Full Collection
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
