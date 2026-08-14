import { useApp, formatSingleImageUrl } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function FeaturedCategories() {
  const { products = [], categories = [], apiCategories = [], apiLoading } = useApp()
  const { ref, isVisible } = useScrollReveal()

  // Extract clean category names from API categories endpoint
  const rawCatList = apiCategories.length > 0 
    ? apiCategories.map(c => typeof c === 'string' ? c : (c.name || String(c.id || '')))
    : categories.filter(c => typeof c === 'string' && c.toLowerCase() !== 'all')

  const catNames = Array.from(new Set(
    rawCatList
      .filter(Boolean)
      .filter(name => name.toLowerCase() !== 'all')
  ))

  // Find image for each category directly from category endpoint or matching products
  const displayCats = catNames.map((name) => {
    const apiCatObj = apiCategories.find(c => (c.name || '').toLowerCase() === name.toLowerCase())
    
    // Check direct category image from API
    let catImage = null
    if (apiCatObj) {
      const rawImg = apiCatObj.imageUrl || apiCatObj.image || apiCatObj.photoUrl || apiCatObj.coverImage
      if (rawImg) {
        catImage = formatSingleImageUrl(rawImg)
      }
    }

    // If no direct image on category object, find matching product in products array
    if (!catImage) {
      // 1. Exact product category match
      const exactProd = products.find(p => 
        (p.category || '').toLowerCase() === name.toLowerCase() ||
        (p.categories || []).some(c => (c.name || '').toLowerCase() === name.toLowerCase())
      )

      if (exactProd && exactProd.images?.[0]) {
        catImage = exactProd.images[0]
      } else {
        // 2. Keyword/substring search in product names or tags
        const words = name.toLowerCase().split(' ').filter(w => w.length > 2)
        const subProd = products.find(p => {
          const pName = (p.name || '').toLowerCase()
          return words.some(w => pName.includes(w))
        })
        if (subProd && subProd.images?.[0]) {
          catImage = subProd.images[0]
        }
      }
    }

    return {
      label: name,
      image: catImage,
      to: `/shop?category=${encodeURIComponent(name.toLowerCase())}`
    }
  })

  // Dynamic layout column spans for 2-column alternating grid
  const getColSpan = (index, total) => {
    if (total === 1) return 'md:col-span-12'
    if (total === 2) return 'md:col-span-6'
    if (total === 3) return 'md:col-span-4'
    
    // For 4 or more: alternate 5 and 7 col spans per row
    const rowPattern = index % 4
    if (rowPattern === 0) return 'md:col-span-5'
    if (rowPattern === 1) return 'md:col-span-7'
    if (rowPattern === 2) return 'md:col-span-7'
    return 'md:col-span-5'
  }

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 px-4 sm:px-8 md:px-12 bg-white"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="max-w-[1440px] mx-auto bg-[#F0EEED] rounded-3xl p-6 sm:p-10 md:p-14">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase text-black text-center tracking-tight mb-8 sm:mb-12 font-sans">
          FIND YOUR FIT
        </h2>

        {apiLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-[170px] sm:h-[230px] bg-gray-200 animate-pulse rounded-2xl ${getColSpan(i, 4)}`} />
            ))}
          </div>
        ) : displayCats.length === 0 ? (
          <p className="text-muted text-sm text-center py-10">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
            {displayCats.map((cat, i) => (
              <Link
                key={cat.label}
                to={cat.to}
                id={`cat-${cat.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className={`group relative overflow-hidden bg-white rounded-2xl h-[170px] sm:h-[230px] md:h-[270px] p-6 sm:p-8 flex flex-col justify-start border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 ${getColSpan(i, displayCats.length)}`}
              >
                {/* Category Title Top Left */}
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black z-10 relative tracking-tight font-sans">
                  {cat.label}
                </span>

                {/* Product/Category Image on Right */}
                {cat.image ? (
                  <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 h-full overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Soft gradient overlay for smooth transition into white card background */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="absolute right-4 bottom-4 w-32 h-32 bg-[#F0EEED] rounded-full flex items-center justify-center opacity-60">
                    <span className="text-black/30 text-xs font-bold uppercase">{cat.label}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
