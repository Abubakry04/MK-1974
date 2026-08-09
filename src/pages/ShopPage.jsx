import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Lowest Price', value: 'price-asc' },
  { label: 'Highest Price', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Highest Rated', value: 'popularity' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₦30,000', min: 0, max: 30000 },
  { label: '₦30,000 – ₦60,000', min: 30000, max: 60000 },
  { label: '₦60,000 – ₦100,000', min: 60000, max: 100000 },
  { label: 'Over ₦100,000', min: 100000, max: Infinity },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const [selectedSize, setSelectedSize] = useState(null)

  const handleQuickAdd = (size) => {
    addToCart(product, size, product.colors?.[0]?.name || 'Standard', 1)
  }

  return (
    <article id={`product-${product.id}`} className="group relative flex flex-col bg-white border border-black/10 rounded-xl overflow-hidden hover:border-black/30 hover:shadow-xl transition-all duration-300 shadow-sm">
      {/* Image Showcase */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F4F2]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#EAEAE8] flex items-center justify-center p-4 text-center">
              <span className="text-black/30 font-bold text-xs uppercase tracking-wider">{product.name}</span>
            </div>
          )}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`text-[0.65rem] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded shadow-sm ${
              product.badge === 'Sale' ? 'bg-red-600 text-white' : 'bg-[#121212] text-white font-bold'
            }`}>
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="text-[0.65rem] font-semibold px-2.5 py-1 bg-black/70 backdrop-blur-md text-white border border-black/10 rounded">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 border shadow-sm ${
            isWishlisted(product.id)
              ? 'bg-[#C4622D] text-white border-[#C4622D] scale-110'
              : 'bg-white/90 text-dark/60 hover:text-dark hover:bg-white border-black/10'
          }`}
          aria-label="Save to wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick Add Overlay */}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="bg-white/95 backdrop-blur-md p-3 border-t border-black/10 shadow-2xl">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-dark/50 mb-2">Quick Add Size</p>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {product.sizes?.slice(0, 5).map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); handleQuickAdd(s); }}
                    className={`text-[0.68rem] font-bold px-2 py-1.5 rounded border transition-all flex-1 ${
                      selectedSize === s
                        ? 'border-[#121212] bg-[#121212] text-white'
                        : 'border-black/15 text-dark/80 hover:border-black hover:text-dark bg-black/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#C4622D] mb-1">{product.category}</p>
          <Link to={`/product/${product.slug}`} className="group-hover:text-[#C4622D] transition-colors">
            <h3 className="text-dark text-sm font-semibold leading-snug line-clamp-1 mb-2">{product.name}</h3>
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-black/5">
          <div className="flex items-baseline gap-2">
            <span className="text-dark font-bold text-base">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-dark/40 text-xs line-through">₦{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {product.colors?.length > 0 && (
            <span className="text-dark/40 text-[0.68rem]">{product.colors.length} Color{product.colors.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </article>
  )
}

function FilterSidebar({ filters, setFilters, categories }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 space-y-7 shadow-sm">
      {/* Category */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4622D] mb-4 flex items-center justify-between">
          <span>Categories</span>
          <span className="text-[0.65rem] text-dark/40 font-normal">{categories.length}</span>
        </h4>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-none">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={filters.category === 'all'}
              onChange={() => setFilters(f => ({ ...f, category: 'all' }))}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              filters.category === 'all' ? 'border-[#C4622D] bg-[#C4622D]' : 'border-black/20 group-hover:border-black'
            }`}>
              {filters.category === 'all' && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
            <span className={`text-xs transition-colors ${filters.category === 'all' ? 'text-dark font-bold' : 'text-dark/70 group-hover:text-dark'}`}>
              All Categories
            </span>
          </label>

          {categories.map(cat => {
            const cleanCat = String(cat).toLowerCase()
            const isSelected = filters.category === cleanCat
            return (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={isSelected}
                  onChange={() => setFilters(f => ({ ...f, category: cleanCat }))}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected ? 'border-[#C4622D] bg-[#C4622D]' : 'border-black/20 group-hover:border-black'
                }`}>
                  {isSelected && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
                <span className={`text-xs capitalize transition-colors ${isSelected ? 'text-dark font-bold' : 'text-dark/70 group-hover:text-dark'}`}>
                  {cat}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4622D] mb-4">Price Range</h4>
        <div className="space-y-2.5">
          {PRICE_RANGES.map(r => {
            const isSelected = filters.priceRange === r.label
            return (
              <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={isSelected}
                  onChange={() => setFilters(f => ({ ...f, priceRange: r.label, priceMin: r.min, priceMax: r.max }))}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  isSelected ? 'border-[#C4622D] bg-[#C4622D]' : 'border-black/20 group-hover:border-black'
                }`}>
                  {isSelected && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
                <span className={`text-xs transition-colors ${isSelected ? 'text-dark font-bold' : 'text-dark/70 group-hover:text-dark'}`}>
                  {r.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4622D] mb-3">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => {
            const isSelected = filters.sizes.includes(s)
            return (
              <button
                key={s}
                onClick={() => setFilters(f => ({
                  ...f,
                  sizes: isSelected ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
                }))}
                className={`min-w-[36px] h-9 px-2.5 text-xs font-bold uppercase rounded border transition-all ${
                  isSelected
                    ? 'border-[#121212] bg-[#121212] text-white shadow-sm'
                    : 'border-black/15 bg-black/5 text-dark/70 hover:border-black hover:text-dark'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4622D] mb-3">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => setFilters(f => ({ ...f, inStockOnly: e.target.checked }))}
            className="hidden"
          />
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            filters.inStockOnly ? 'border-[#C4622D] bg-[#C4622D]' : 'border-black/20 group-hover:border-black'
          }`}>
            {filters.inStockOnly && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
          <span className="text-xs text-dark/70 group-hover:text-dark transition-colors">In Stock Items Only</span>
        </label>
      </div>

      <button
        onClick={() => setFilters({ category: 'all', priceRange: '', priceMin: 0, priceMax: Infinity, sizes: [], inStockOnly: false })}
        className="w-full py-2.5 border border-black/15 hover:bg-black/5 text-dark/70 hover:text-dark text-xs font-semibold uppercase tracking-wider rounded transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}

const EMPTY_FILTERS = { category: 'all', priceRange: '', priceMin: 0, priceMax: Infinity, sizes: [], inStockOnly: false }

export default function ShopPage() {
  usePageMeta('Shop All — MK 1974', 'Browse the full MK 1974 collection — tracksuits, jerseys, tees, hoodies and Lagos streetwear.')
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
  const PER_PAGE = 12

  const filtered = useMemo(() => {
    let products = [...storeProducts]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.category !== 'all') {
      products = products.filter(p => {
        const catClean = filters.category.toLowerCase()
        const matchMain = p.category?.toLowerCase() === catClean || p.category?.toLowerCase().includes(catClean)
        const matchSub = p.subcategory?.toLowerCase() === catClean
        const matchTag = p.tags?.some(t => t.toLowerCase() === catClean || t.toLowerCase().includes(catClean))
        const matchApi = p.categories?.some(c => {
          const n = c.name?.toLowerCase() || ''
          return n === catClean || n.includes(catClean)
        })
        return matchMain || matchSub || matchTag || matchApi
      })
    }

    if (filters.priceMin || filters.priceMax < Infinity) {
      products = products.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax)
    }

    if (filters.sizes.length > 0) {
      products = products.filter(p => p.sizes?.some(s => filters.sizes.includes(s)))
    }

    if (filters.inStockOnly) {
      products = products.filter(p => p.inStock)
    }

    switch (sort) {
      case 'price-asc': products.sort((a, b) => a.price - b.price); break
      case 'price-desc': products.sort((a, b) => b.price - a.price); break
      case 'best-selling': products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break
      case 'popularity': products.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      default:
        products.sort((a, b) => {
          const aNew = a.newArrival ? 1 : 0
          const bNew = b.newArrival ? 1 : 0
          if (bNew !== aNew) return bNew - aNew
          return Number(b.id) - Number(a.id)
        })
    }

    return products
  }, [filters, sort, searchQuery, storeProducts])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const categoriesList = useMemo(() => {
    const list = storefrontCategories.map(c => typeof c === 'string' ? c : c.name)
    return Array.from(new Set(list)).filter(Boolean)
  }, [storefrontCategories])

  return (
    <>
      <Nav />
      <main className="bg-[#F7F7F6] text-[#121212] min-h-screen pt-24 sm:pt-28 pb-24">
        
        {/* Header Banner */}
        <div className="bg-white border-b border-black/10 px-4 sm:px-8 md:px-12 pb-8 pt-4 shadow-sm">
          <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block mb-1 text-[#C4622D] font-bold">MK 1974 Official Shop</span>
              <h1 className="font-playfair italic font-black text-dark text-3xl sm:text-5xl">Shop Collection</h1>
            </div>
            <p className="text-dark/60 text-xs tracking-wider uppercase font-semibold">
              Showing <span className="text-[#C4622D] font-bold">{filtered.length}</span> Products
            </p>
          </div>

          {/* Quick Category Pills Carousel */}
          <div className="max-w-[1320px] mx-auto mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { setFilters(f => ({ ...f, category: 'all' })); setPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full shrink-0 transition-all ${
                filters.category === 'all'
                  ? 'bg-[#121212] text-white shadow-md'
                  : 'bg-white border border-black/15 text-dark/70 hover:text-dark hover:bg-black/5'
              }`}
            >
              All Products
            </button>
            {categoriesList.map(cat => {
              const clean = String(cat).toLowerCase()
              const isSelected = filters.category === clean
              return (
                <button
                  key={cat}
                  onClick={() => { setFilters(f => ({ ...f, category: clean })); setPage(1); }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full shrink-0 transition-all capitalize ${
                    isSelected
                      ? 'bg-[#121212] text-white shadow-md'
                      : 'bg-white border border-black/15 text-dark/70 hover:text-dark hover:bg-black/5'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 py-8 sm:py-10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                id="shop-search"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search collection, tracksuits, jerseys..."
                className="w-full bg-white border border-black/15 text-dark placeholder:text-dark/40 text-xs pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#C4622D] transition-colors shadow-sm"
              />
            </div>

            {/* Filter Toggle (Mobile) + Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                id="filter-toggle"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border border-black/15 text-dark text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-lg hover:border-black transition-colors shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
                <span>Filters</span>
              </button>

              <div className="relative flex-1 sm:flex-initial">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-black/15 text-dark text-xs font-semibold tracking-wider uppercase px-4 py-3 pr-9 rounded-lg focus:outline-none focus:border-[#C4622D] appearance-none cursor-pointer shadow-sm"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-white text-dark">{o.label}</option>)}
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Sidebar + Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <FilterSidebar filters={filters} setFilters={setFilters} categories={categoriesList} />
            </aside>

            {/* Product Grid Container */}
            <div className="lg:col-span-9">
              {apiLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl p-3 border border-black/10">
                      <div className="aspect-[3/4] bg-black/10 rounded-lg mb-3" />
                      <div className="h-4 bg-black/10 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-black/10 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-20 bg-white border border-black/10 rounded-xl p-8 shadow-sm">
                  <div className="w-16 h-16 border border-black/10 rounded-full flex items-center justify-center mx-auto mb-4 bg-black/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark/40">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">No matching products found</h3>
                  <p className="text-dark/50 text-xs mb-6 max-w-sm mx-auto">Try clearing your search query or resetting active price and category filters.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setFilters(EMPTY_FILTERS); }}
                    className="px-6 py-3 bg-[#121212] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#C4622D] transition-colors shadow-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div id="productsGrid" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-10 h-10 border border-black/15 text-dark/70 hover:border-black hover:text-dark disabled:opacity-30 transition-all flex items-center justify-center rounded-lg bg-white shadow-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-10 h-10 text-xs font-bold border transition-all rounded-lg ${
                            page === i + 1
                              ? 'border-[#121212] bg-[#121212] text-white shadow-md'
                              : 'border-black/15 bg-white text-dark/70 hover:border-black hover:text-dark'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-10 h-10 border border-black/15 text-dark/70 hover:border-black hover:text-dark disabled:opacity-30 transition-all flex items-center justify-center rounded-lg bg-white shadow-sm"
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

      {/* ── Mobile Filter Bottom Sheet ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative z-10 bg-white border-t border-black/15 rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-dark">
            <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-black/10">
              <div className="w-10 h-1 rounded-full bg-black/20 absolute top-2.5 left-1/2 -translate-x-1/2" />
              <p className="text-dark font-bold text-xs tracking-[0.2em] uppercase mt-2">Filter Products</p>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-dark/50 hover:text-dark transition-colors mt-2 p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 bg-[#F7F7F6]">
              <FilterSidebar filters={filters} setFilters={setFilters} categories={categoriesList} />
            </div>
            <div className="p-4 border-t border-black/10 bg-white">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-3.5 bg-[#121212] hover:bg-[#C4622D] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg"
              >
                Apply Filters ({filtered.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
