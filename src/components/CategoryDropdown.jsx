import { useState, useRef, useEffect } from 'react'

export default function CategoryDropdown({
  categories = [],
  selectedCategory = 'all',
  onSelect,
  label = 'Category',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format category list uniquely
  const categoryOptions = [
    { value: 'all', name: 'All Products' },
    ...categories
      .map(cat => {
        const name = typeof cat === 'string' ? cat : (cat?.name || String(cat?.id || ''))
        return {
          value: name.toLowerCase().trim(),
          name: name.trim()
        }
      })
      .filter(c => c.value && c.value !== 'all' && c.value !== 'all products')
      .filter((c, idx, arr) => arr.findIndex(x => x.value === c.value) === idx)
  ]

  // Filter categories by search if typed
  const filteredOptions = categoryOptions.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
  )

  const activeOption = categoryOptions.find(
    c => c.value === String(selectedCategory).toLowerCase().trim()
  ) || categoryOptions[0]

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="group relative flex items-center justify-between gap-3 w-full sm:w-72 bg-white hover:bg-stone-50 border border-black/15 hover:border-black rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider text-dark transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.99]"
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#C4622D] shrink-0" />
          <span className="text-dark/50 text-[0.65rem] tracking-[0.2em] font-semibold">
            {label}:
          </span>
          <span className="font-extrabold text-dark truncate">
            {activeOption.name}
          </span>
        </div>

        {/* Animated Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`shrink-0 text-dark/70 transition-transform duration-300 ${isOpen ? 'rotate-180 text-dark' : 'group-hover:translate-y-0.5'}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full sm:w-80 rounded-2xl bg-white/95 backdrop-blur-md border border-black/10 shadow-2xl z-50 py-2.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header & Quick Search if > 5 categories */}
          {categoryOptions.length > 5 && (
            <div className="px-3 pb-2 mb-1 border-b border-stone-100">
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search category..."
                className="w-full bg-stone-100 text-dark placeholder:text-dark/40 text-[0.72rem] font-medium px-3 py-2 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-black/20"
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-stone-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = activeOption.value === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSelect(option.value)
                      setIsOpen(false)
                      setSearchFilter('')
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-left transition-colors duration-150 ${
                      isSelected
                        ? 'bg-dark text-white font-bold'
                        : 'text-dark/80 hover:bg-stone-100 hover:text-dark'
                    }`}
                  >
                    <span className="capitalize tracking-wide truncate">{option.name}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 text-[#C4622D]">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 text-xs text-dark/40 text-center">
                No matching categories
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
