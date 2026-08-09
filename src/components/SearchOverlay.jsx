import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, products, categories } = useApp()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Build real category suggestions from the store
  const categorySuggestions = categories
    .map(c => (typeof c === 'string' ? c : c?.name))
    .filter(Boolean)
    .filter(name => name.toLowerCase() !== 'all')
    .slice(0, 6)

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : []

  const handleSelect = (slug) => {
    setSearchOpen(false)
    setQuery('')
    navigate(`/product/${slug}`)
  }

  const handleCategoryClick = (cat) => {
    setSearchOpen(false)
    setQuery('')
    navigate(`/shop?category=${encodeURIComponent(cat.toLowerCase())}`)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[200] bg-dark/95 flex flex-col">
      {/* Search input bar */}
      <div className="flex items-center gap-4 px-8 md:px-12 py-5 border-b border-white/[0.06]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') { setSearchOpen(false); setQuery('') }
            if (e.key === 'Enter' && results[0]) handleSelect(results[0].slug)
          }}
          placeholder="Search products, categories..."
          className="flex-1 bg-transparent text-cream text-lg font-light placeholder-muted/50 focus:outline-none"
        />
        <button
          onClick={() => { setSearchOpen(false); setQuery('') }}
          className="text-muted hover:text-cream transition-colors text-sm"
        >
          Close
        </button>
      </div>

      {/* Results / Suggestions */}
      <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 max-w-[760px] w-full mx-auto">
        {query.length <= 1 ? (
          /* Show real categories as hints */
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-4">Shop by category</p>
            <div className="flex flex-wrap gap-2">
              {categorySuggestions.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="px-4 py-2 border border-white/10 text-cream/60 text-sm hover:border-white/30 hover:text-cream hover:bg-white/5 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Recent / popular products while idle */}
            {products.length > 0 && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-muted mb-4">Popular right now</p>
                <div className="space-y-1">
                  {products.slice(0, 3).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(p.slug)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-10 aspect-[3/4] overflow-hidden bg-surface2 shrink-0">
                        <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-cream text-sm group-hover:text-accent transition-colors">{p.name}</p>
                        <p className="text-muted text-xs">{p.category}</p>
                      </div>
                      <span className="text-cream/60 text-sm">₦{Number(p.price).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : results.length === 0 ? (
          <div>
            <p className="text-cream/30 text-sm mb-6">No results for "<span className="text-cream">{query}</span>"</p>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">Try a category instead</p>
            <div className="flex flex-wrap gap-2">
              {categorySuggestions.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="px-4 py-2 border border-white/10 text-cream/60 text-sm hover:border-white/30 hover:text-cream transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="space-y-1">
              {results.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.slug)}
                  className="w-full flex items-center gap-5 p-4 hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="w-12 aspect-[3/4] overflow-hidden bg-surface2 shrink-0">
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cream text-sm font-medium group-hover:text-accent transition-colors">{p.name}</p>
                    <p className="text-muted text-xs mt-0.5">{p.category}</p>
                  </div>
                  <span className="text-cream text-sm">₦{Number(p.price).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
