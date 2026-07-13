import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Lowest Price', value: 'price-asc' },
  { label: 'Highest Price', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Popularity', value: 'popularity' },
]

const PRICE_RANGES = [
  { label: 'Under ₦50', min: 0, max: 50 },
  { label: '₦50 – ₦100', min: 50, max: 100 },
  { label: '₦100 – ₦150', min: 100, max: 150 },
  { label: 'Over ₦150', min: 150, max: Infinity },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']


function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const [hoveredSize, setHoveredSize] = useState(null)

  return (
    <article id={product.id} className="group cursor-pointer">
      <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4">
        <Link to={`/product/${product.slug}`}>
          <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {product.images[1] && (
            <img src={product.images[1]} alt={product.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`text-[0.55rem] font-black tracking-[0.2em] uppercase px-2.5 py-1 ${
              product.badge === 'Sale' ? 'bg-red-500 text-white' : 'bg-lime text-dark'
            }`}>{product.badge}</span>
          )}
          {!product.inStock && (
            <span className="text-[0.55rem] font-black tracking-[0.2em] uppercase px-2.5 py-1 bg-surface2 text-muted border border-white/10">Sold Out</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-dark/60 backdrop-blur-sm transition-all duration-200 ${
            isWishlisted(product.id) ? 'text-lime' : 'text-cream/60 hover:text-cream'
          }`}
          aria-label="Add to wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick Add overlay */}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-dark/95 backdrop-blur-md p-3">
              <p className="text-muted text-[0.55rem] tracking-[0.25em] uppercase mb-2">Select Size</p>
              <div className="flex gap-1.5 mb-3">
                {product.sizes.slice(0, 5).map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoveredSize(s)}
                    onMouseLeave={() => setHoveredSize(null)}
                    onClick={() => addToCart(product, s, product.colors[0].name)}
                    className={`text-[0.55rem] font-medium w-8 h-8 border transition-all duration-150 ${
                      hoveredSize === s ? 'border-lime text-lime' : 'border-white/20 text-cream/60 hover:border-white/40'
                    }`}
                  >{s}</button>
                ))}
              </div>
              <button
                onClick={() => addToCart(product, product.sizes[2] || product.sizes[0], product.colors[0].name)}
                className="w-full bg-lime text-dark text-[0.6rem] font-black tracking-[0.25em] uppercase py-2.5 hover:bg-lime-dim transition-colors"
              >
                Add to Bag — ₦{product.price}
              </button>
            </div>
          </div>
        )}
      </div>

      <Link to={`/product/${product.slug}`}>
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-cream text-[0.85rem] font-medium tracking-[0.03em] leading-tight">{product.name}</h3>
          <div className="text-right shrink-0 ml-3">
            <span className="text-cream text-[0.88rem]">₦{product.price}</span>
            {product.originalPrice && <span className="block text-muted text-[0.7rem] line-through">₦{product.originalPrice}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {product.colors.slice(0, 4).map(c => (
            <div key={c.name} className="w-3 h-3 rounded-full border border-white/20" style={{ background: c.hex }} title={c.name} />
          ))}
          {product.colors.length > 4 && <span className="text-muted text-[0.65rem]">+{product.colors.length - 4}</span>}
        </div>
      </Link>
    </article>
  )
}

function FilterSidebar({ filters, setFilters, onClose, categories }) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h4 className="text-black text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-4">Category</h4>
        <div className="space-y-2.5">
          {displayedCategories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.toLowerCase()}
                onChange={() => setFilters(f => ({ ...f, category: cat.toLowerCase() }))}
                className="hidden"
              />
              <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                filters.category === cat.toLowerCase() ? 'border-lime bg-lime' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {filters.category === cat.toLowerCase() && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <span className={`text-[0.8rem] transition-colors ${filters.category === cat.toLowerCase() ? 'text-black' : 'text-black/40 group-hover:text-black'}`}>{cat}</span>
            </label>
          ))}
          {categories.length > 5 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-black/40 hover:text-black text-[0.72rem] font-semibold tracking-wider uppercase mt-2 block"
            >
              {showAllCategories ? 'Show Less' : `+ View All (${categories.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-black text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-4">Price Range</h4>
        <div className="space-y-2.5">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.priceRange === r.label}
                onChange={() => setFilters(f => ({ ...f, priceRange: r.label, priceMin: r.min, priceMax: r.max }))}
                className="hidden"
              />
              <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                filters.priceRange === r.label ? 'border-lime bg-lime' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {filters.priceRange === r.label && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <span className={`text-[0.8rem] transition-colors ${filters.priceRange === r.label ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-black text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setFilters(f => ({
                ...f,
                sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
              }))}
              className={`w-10 h-10 text-[0.7rem] font-medium border transition-all ${
                filters.sizes.includes(s) ? 'border-lime text-black/40' : 'border-black/20 text-black/60 hover:border-black/40 hover:text-black'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-black text-[0.65rem] font-semibold tracking-[0.3em] uppercase mb-4">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => setFilters(f => ({ ...f, inStockOnly: e.target.checked }))}
            className="hidden"
          />
          <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
            filters.inStockOnly ? 'border-black/40 bg-lime' : 'border-black/20 group-hover:border-black'
          }`}>
            {filters.inStockOnly && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
          <span className="text-black/60 text-[0.8rem] group-hover:text-black transition-colors">In Stock Only</span>
        </label>
      </div>

      <button
        onClick={() => setFilters({ category: 'all', priceRange: '', priceMin: 0, priceMax: Infinity, sizes: [], inStockOnly: false })}
        className="text-muted text-[0.65rem] tracking-[0.25em] uppercase hover:text-lime transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default function ShopPage() {
  const { products: storeProducts, categories: storefrontCategories } = useApp()
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: '',
    priceMin: 0,
    priceMax: Infinity,
    sizes: [],
    inStockOnly: false,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const PER_PAGE = 8

  const filtered = useMemo(() => {
    let products = [...storeProducts]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }

    // Category
    if (filters.category !== 'all') {
      products = products.filter(p => {
        const catClean = filters.category.toLowerCase()
        const matchMain = p.category?.toLowerCase() === catClean
        const matchSub = p.subcategory?.toLowerCase() === catClean
        const matchTag = p.tags?.some(t => t.toLowerCase() === catClean)
        const matchApi = p.categories?.some(c => c.name.toLowerCase() === catClean)
        return matchMain || matchSub || matchTag || matchApi
      })
    }

    // Price
    if (filters.priceMin || filters.priceMax < Infinity) {
      products = products.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax)
    }

    // In stock
    if (filters.inStockOnly) products = products.filter(p => p.inStock)

    // Sort
    switch (sort) {
      case 'price-asc': products.sort((a, b) => a.price - b.price); break
      case 'price-desc': products.sort((a, b) => b.price - a.price); break
      case 'best-selling': products.sort((a, b) => b.reviews - a.reviews); break
      case 'popularity': products.sort((a, b) => b.rating - a.rating); break
      default: products.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
    }

    return products
  }, [filters, sort, searchQuery])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <Nav />
      <main className="bg-surface2 min-h-screen pt-24">
        {/* Page header */}
        <div className="bg-surface2  px-8 md:px-12 py-10">
          <div className="max-w-[1440px] mx-auto">
            <p className="eyebrow mb-2">Browse</p>
            <h1 className="font-playfair font-black italic text-4xl md:text-5xl" style={{ color: '#1A1A1A' }}>Shop All</h1>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                id="shop-search"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="Search products..."
                className="w-full bg-surface border border-black/10 text-onlight placeholder-muted text-[0.82rem] pl-10 pr-4 py-3 focus:outline-none focus:border-lime/40 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter toggle (mobile) */}
              <button
                id="filter-toggle"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 text-cream/60 text-[0.72rem] tracking-[0.2em] uppercase hover:text-cream transition-colors border border-white/10 px-4 py-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
                Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1) }}
                  className="bg-surface border border-black/10 text-onlight text-[0.75rem] tracking-[0.1em] px-4 py-3 pr-8 focus:outline-none focus:border-lime/40 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              <span className="text-muted text-[0.72rem]">{filtered.length} items</span>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Sidebar */}
            <aside className={`shrink-0 w-56 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setFiltersOpen(false)} categories={storefrontCategories} />
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {paginated.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-cream/30 text-[0.85rem] tracking-[0.2em] uppercase">No products found</p>
                  <button onClick={() => { setSearchQuery(''); setFilters({ category: 'all', priceRange: '', priceMin: 0, priceMax: Infinity, sizes: [], inStockOnly: false }) }} className="btn-ghost mt-6">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div id="productsGrid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                    {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-10 h-10 border border-white/10 text-cream/60 hover:border-white/30 hover:text-cream disabled:opacity-30 transition-all flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 text-[0.75rem] font-medium border transition-all ${
                            page === i + 1 ? 'border-lime text-lime' : 'border-white/10 text-cream/60 hover:border-white/30 hover:text-cream'
                          }`}
                        >{i + 1}</button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-10 h-10 border border-white/10 text-cream/60 hover:border-white/30 hover:text-cream disabled:opacity-30 transition-all flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
