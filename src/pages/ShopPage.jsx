import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

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

const SIZES = ['S', 'M', 'L', 'XL']

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const [hoveredSize, setHoveredSize] = useState(null)

  return (
    <article id={product.id} className="group cursor-pointer active:scale-95 transition-transform duration-200">
      <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4 rounded-md">
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
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-full transition-all duration-200 shadow-sm hover:scale-110 active:scale-125 ${
            isWishlisted(product.id) ? 'text-lime' : 'text-onlight/60 hover:text-onlight'
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
                Add to Bag — ₦{product.price.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>

      <Link to={`/product/${product.slug}`}>
        <div className="flex justify-between items-start mb-1.5 mt-4">
          <h3 className="text-onlight text-[0.85rem] font-medium tracking-[0.03em] leading-tight group-hover:text-lime transition-colors">{product.name}</h3>
          <div className="text-right shrink-0 ml-3">
            <span className="text-onlight font-semibold text-[0.88rem]">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="block text-muted text-[0.7rem] line-through">₦{product.originalPrice.toLocaleString()}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {product.colors.slice(0, 4).map(c => (
            <div key={c.name} className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" style={{ background: c.hex }} title={c.name} />
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

const EMPTY_FILTERS = { category: 'all', priceRange: '', priceMin: 0, priceMax: Infinity, sizes: [], inStockOnly: false }

export default function ShopPage() {
  usePageMeta('Shop All', 'Browse the full MK 1974 collection — premium tracksuits, jerseys, joggers and streetwear.')
  const { products: storeProducts, categories: storefrontCategories, apiLoading } = useApp()
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

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }

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

    if (filters.priceMin || filters.priceMax < Infinity) {
      products = products.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax)
    }

    if (filters.inStockOnly) products = products.filter(p => p.inStock)

    switch (sort) {
      case 'price-asc': products.sort((a, b) => a.price - b.price); break
      case 'price-desc': products.sort((a, b) => b.price - a.price); break
      case 'best-selling': products.sort((a, b) => b.reviews - a.reviews); break
      case 'popularity': products.sort((a, b) => b.rating - a.rating); break
      default: products.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
    }

    return products
  }, [filters, sort, searchQuery, storeProducts])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <Nav />
      <main className="bg-surface2 min-h-screen pt-24">
        {/* Page header */}
        <div className="bg-surface2 px-8 md:px-12 py-10 border-b border-black/[0.04]">
          <div className="max-w-[1440px] mx-auto flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Browse</p>
              <h1 className="font-playfair font-black italic text-4xl md:text-5xl" style={{ color: '#1A1A1A' }}>Shop All</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 pb-1">
              <div className="w-8 h-px bg-lime/40" />
              <span className="text-muted text-[0.65rem] tracking-[0.25em] uppercase">{filtered.length} pieces</span>
            </div>
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
              {/* Filter toggle (mobile) — opens bottom drawer */}
              <button
                id="filter-toggle"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-onlight text-[0.72rem] tracking-[0.2em] uppercase hover:text-lime transition-colors border border-black/20 px-4 py-3"
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
            {/* Sidebar — desktop only */}
            <aside className="shrink-0 w-56 hidden lg:block">
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setFiltersOpen(false)} categories={storefrontCategories} />
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {apiLoading ? (
                <div className="py-8 space-y-6">
                  <div className="flex items-center justify-center py-6 gap-3">
                    <div className="w-5 h-5 border-2 border-lime border-t-transparent rounded-full animate-spin" />
                    <span className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-dark/50">Loading Collection...</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] bg-dark/5 rounded-md mb-4 border border-dark/5" />
                        <div className="h-4 bg-dark/10 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-dark/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-black/[0.04] rounded-md shadow-sm">
                  <p className="text-onlight/40 text-[0.85rem] tracking-[0.2em] uppercase">No products found</p>
                  <button onClick={() => { setSearchQuery(''); setFilters(EMPTY_FILTERS) }} className="btn-text mt-6">
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
                        className="w-10 h-10 border border-black/10 text-onlight/60 hover:border-black/30 hover:text-onlight disabled:opacity-30 transition-all flex items-center justify-center rounded-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 text-[0.75rem] font-medium border transition-all rounded-sm ${
                            page === i + 1 ? 'border-lime text-lime bg-lime/10' : 'border-black/10 text-onlight/60 hover:border-black/30 hover:text-onlight'
                          }`}
                        >{i + 1}</button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-10 h-10 border border-black/10 text-onlight/60 hover:border-black/30 hover:text-onlight disabled:opacity-30 transition-all flex items-center justify-center rounded-sm"
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

      {/* ── Mobile Filter Bottom Drawer ── */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-[200] bg-dark/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            filtersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setFiltersOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`fixed inset-x-0 bottom-0 z-[210] bg-white rounded-t-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:hidden max-h-[80vh] flex flex-col ${
            filtersOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Handle + header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-5 border-b border-black/[0.06] shrink-0">
            <div className="w-10 h-1 rounded-full bg-black/15 absolute top-3 left-1/2 -translate-x-1/2" />
            <p className="text-black font-semibold text-[0.85rem] tracking-[0.1em] uppercase mt-2">Filters</p>
            <button
              onClick={() => setFiltersOpen(false)}
              className="text-black/40 hover:text-black transition-colors mt-2"
              aria-label="Close filters"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {/* Scrollable filter content */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setFiltersOpen(false)} categories={storefrontCategories} />
          </div>
          {/* Apply button */}
          <div className="shrink-0 px-6 pb-8 pt-4 border-t border-black/[0.06]">
            <button
              onClick={() => setFiltersOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      </>

      <Footer />
    </>
  )
}
