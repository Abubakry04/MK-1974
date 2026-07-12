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
      <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="text-[0.58rem] font-semibold tracking-[0.25em] uppercase text-dark bg-lime px-3 py-1">
              {product.badge}
            </span>
          </div>
        )}

        {/* Add to bag overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product, product.sizes[0] || 'M', firstColor) }}
            className="w-full bg-dark/90 backdrop-blur-sm text-cream text-[0.65rem] font-medium tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-dark transition-colors duration-200"
          >
            Add to Bag — ₦{product.price}
          </button>
        </div>
      </div>

      </Link>
      {/* Info */}
      <Link to={`/product/${product.slug}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-cream text-[0.88rem] font-medium tracking-[0.05em]">{product.name}</h3>
            <p className="text-muted text-[0.75rem] tracking-[0.05em] mt-0.5">{firstColor}</p>
          </div>
          <span className="text-cream text-[0.88rem] font-light tracking-wider">₦{product.price}</span>
        </div>
      </Link>
    </article>
  )
}

export default function Collection() {
  const { products, categories: appCats } = useApp()
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
    <section id="collection" className="bg-dark py-24 md:py-32 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-3">The Range</p>
            <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
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
                className={`px-4 py-2 text-[0.62rem] font-medium tracking-[0.25em] uppercase transition-all duration-200
                  ${activeFilter === f.value
                    ? 'bg-lime text-dark'
                    : 'text-muted hover:text-cream border border-white/10 hover:border-white/30'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {visible.length > 0 ? (
          <div id="productsGrid" className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {visible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(242,235,220,0.3)', fontSize: 13 }}>
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
