import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const products = [
  { id: 'prod-1', slug: 'volt-track-jacket', img: '/product2.png', alt: 'Volt Track Jacket', badge: 'New', name: 'Volt Track Jacket', variant: 'Olive / Stone / Black', price: 89, category: 'tracksuit' },
  { id: 'prod-2', slug: 'motion-jogger-set', img: '/product1.png', alt: 'Motion Jogger Set', badge: 'Bestseller', name: 'Motion Jogger Set', variant: 'Charcoal / Black', price: 75, category: 'joggers' },
  { id: 'prod-3', slug: 'shadow-tapered-jogger', img: '/product3.png', alt: 'Shadow Tapered Jogger', name: 'Shadow Tapered Jogger', variant: 'Black / Graphite', price: 59, category: 'joggers' },
  { id: 'prod-4', slug: 'apex-full-tracksuit', img: '/hero.png', alt: 'Apex Full Tracksuit', badge: 'Limited', name: 'Apex Full Tracksuit', variant: 'Black / Volt', price: 129, category: 'tracksuit' },
  { id: 'prod-5', slug: 'terra-fleece-set', img: '/product1.png', alt: 'Terra Fleece Set', name: 'Terra Fleece Set', variant: 'Sand / Stone / Dusk', price: 95, category: 'fleece' },
  { id: 'prod-6', slug: 'drift-track-top', img: '/product2.png', alt: 'Drift Track Top', name: 'Drift Track Top', variant: 'Olive / Midnight', price: 69, category: 'tracksuit' },
]

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Tracksuits', value: 'tracksuit' },
  { label: 'Joggers', value: 'joggers' },
  { label: 'Fleece', value: 'fleece' },
]

function ProductCard({ product }) {
  const { addToCart } = useApp()

  return (
    <article id={product.id} className="group cursor-pointer">
      <Link to={`/product/${product.slug}`}>
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4">
        <img
          src={product.img}
          alt={product.alt}
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
            onClick={(e) => { e.preventDefault(); addToCart({ id: product.id, name: product.name, price: product.price, slug: product.slug, images: [product.img], sizes: ['S','M','L','XL'], colors: [{name: product.variant}] }, 'M', product.variant) }}
            className="w-full bg-dark/90 backdrop-blur-sm text-cream text-[0.65rem] font-medium tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-dark transition-colors duration-200"
          >
            Add to Bag — £{product.price}
          </button>
        </div>
      </div>

      </Link>
      {/* Info */}
      <Link to={`/product/${product.slug}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-cream text-[0.88rem] font-medium tracking-[0.05em]">{product.name}</h3>
            <p className="text-muted text-[0.75rem] tracking-[0.05em] mt-0.5">{product.variant}</p>
          </div>
          <span className="text-cream text-[0.88rem] font-light tracking-wider">£{product.price}</span>
        </div>
      </Link>
    </article>
  )
}

export default function Collection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const visible = products.filter(p => activeFilter === 'all' || p.category === activeFilter)

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
          <div className="flex gap-1">
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
        <div id="productsGrid" className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
          {visible.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* View all CTA */}
        <div className="mt-20 flex justify-center">
          <Link to="/collection" className="btn-ghost">
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
