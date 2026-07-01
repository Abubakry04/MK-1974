import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useApp } from '../context/AppContext'

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useApp()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = query.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.includes(query.toLowerCase()))
      ).slice(0, 6)
    : []

  const suggestions = ['Black Hoodie', 'Tracksuit', 'Joggers', 'Fleece Set', 'Volt Jacket']

  const handleSelect = (slug) => {
    setSearchOpen(false)
    setQuery('')
    navigate(`/product/${slug}`)
  }

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[200] bg-dark/97 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-6 px-8 md:px-12 py-6 border-b border-white/[0.05]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') setSearchOpen(false)
            if (e.key === 'Enter' && results[0]) handleSelect(results[0].slug)
          }}
          placeholder="Search for products, categories..."
          className="flex-1 bg-transparent text-cream text-[1rem] md:text-[1.2rem] font-light placeholder-muted focus:outline-none"
        />
        <button
          onClick={() => { setSearchOpen(false); setQuery('') }}
          className="text-muted hover:text-cream transition-colors text-[0.65rem] tracking-[0.25em] uppercase"
        >
          Close ✕
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 max-w-[800px] w-full mx-auto">
        {query.length <= 1 ? (
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted mb-5">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-2 border border-white/10 text-cream/70 text-[0.78rem] hover:border-lime hover:text-lime transition-all"
                >{s}</button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-cream/30 text-[0.9rem]">No results for "<span className="text-cream">{query}</span>"</p>
          </div>
        ) : (
          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted mb-5">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            <div className="space-y-2">
              {results.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.slug)}
                  className="w-full flex items-center gap-5 p-4 hover:bg-surface transition-colors text-left group"
                >
                  <div className="w-14 h-18 aspect-[3/4] overflow-hidden bg-surface2 shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cream font-medium text-[0.9rem] group-hover:text-lime transition-colors">{p.name}</p>
                    <p className="text-muted text-[0.75rem]">{p.category} · {p.colors[0].name}</p>
                  </div>
                  <span className="text-cream text-[0.9rem] font-medium">£{p.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
