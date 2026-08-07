import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.floor(rating) ? '#C4622D' : 'none'} stroke="#C4622D" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  )
}

const MOCK_REVIEWS = [
  { id: 1, name: 'James L.', rating: 5, date: 'Apr 2026', title: 'Absolute quality', body: 'Couldn\'t be happier with this purchase. The material is incredibly premium and the fit is spot on. MK 1974 delivers top tier quality.', verified: true },
  { id: 2, name: 'Sarah M.', rating: 4, date: 'Mar 2026', title: 'Great product, clean silhouette', body: 'Really happy with the quality. Premium heavy cotton feel. Recommend true to size for an athletic relaxed look.', verified: true },
  { id: 3, name: 'Chris T.', rating: 5, date: 'Feb 2026', title: 'My new staple piece', body: 'I own multiple pieces from MK 1974 and this drop is exceptional. Fast nationwide delivery to Lagos too.', verified: false },
]

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, addToCart, toggleWishlist, isWishlisted, showToast, addToRecentlyViewed, recentlyViewed } = useApp()

  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug])

  usePageMeta(
    product ? product.name : 'Product Details',
    product ? `${product.name} — ${product.description?.slice(0, 120) || 'Premium MK 1974 Lagos streetwear.'}` : ''
  )

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
      setSelectedImage(0)
      setSelectedColor(0)
      setSelectedSize(null)
    }
  }, [product?.id])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % product.images.length)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, product])

  if (!product) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center px-6">
          <div className="text-center max-w-md py-20">
            <p className="text-cream/40 text-xs tracking-[0.3em] uppercase mb-6">Product not found</p>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize) { showToast('Please select a size', 'error'); return }
    addToCart(product, selectedSize, product.colors?.[selectedColor]?.name || 'Standard', qty)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { showToast('Please select a size', 'error'); return }
    addToCart(product, selectedSize, product.colors?.[selectedColor]?.name || 'Standard', qty)
    navigate('/checkout')
  }

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-24 sm:pt-28 pb-24 text-cream">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-8 md:px-12 py-4 border-b border-white/10">
          <div className="max-w-[1320px] mx-auto flex items-center gap-2 text-[0.68rem] text-cream/50 tracking-[0.15em] uppercase">
            <Link to="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-cream transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-cream font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            
            {/* ── Left Column: Gallery ── */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sm:gap-6">
              {/* Desktop Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] scrollbar-none py-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 sm:w-20 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-lime ring-2 ring-lime/30 scale-105' : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Container */}
              <div className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl group cursor-zoom-in">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0] || '/product2.png'}
                  alt={product.name}
                  onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true) }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[0.65rem] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded shadow ${
                      product.badge === 'Sale' ? 'bg-red-600 text-white' : 'bg-lime text-dark font-black'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Zoom hint button */}
                <button
                  onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true) }}
                  className="absolute bottom-4 right-4 bg-dark/70 backdrop-blur-md border border-white/20 text-cream text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-dark transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  <span>Zoom</span>
                </button>
              </div>
            </div>

            {/* ── Right Column: Product Controls (Sticky) ── */}
            <div className="lg:col-span-5 flex flex-col md:sticky md:top-28 h-fit space-y-6">
              <div>
                <p className="eyebrow block mb-2">{product.category}</p>
                <h1 className="font-playfair italic font-black text-cream text-3xl sm:text-4xl leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <StarRating rating={product.rating || 5} />
                  <span className="text-cream text-xs font-semibold">{product.rating || 5.0}</span>
                  <span className="text-cream/40 text-xs">({product.reviews || 0} reviews)</span>
                  <span className="text-cream/20">•</span>
                  <span className={`text-xs font-semibold tracking-[0.15em] uppercase flex items-center gap-1.5 ${product.inStock ? 'text-lime' : 'text-red-400'}`}>
                    <span className="w-2 h-2 rounded-full bg-current inline-block" />
                    {product.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-cream text-3xl sm:text-4xl font-bold tracking-tight">₦{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-cream/40 text-lg sm:text-xl line-through">₦{product.originalPrice.toLocaleString()}</span>
                      <span className="bg-lime/20 text-lime text-xs font-semibold px-2.5 py-1 rounded">
                        Save ₦{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/70 mb-3">
                      Colour: <span className="text-cream font-bold">{product.colors?.[selectedColor]?.name || ''}</span>
                    </p>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c, i) => (
                        <button
                          key={c.name || i}
                          onClick={() => setSelectedColor(i)}
                          title={c.name}
                          className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                            selectedColor === i ? 'border-lime ring-2 ring-lime/40 scale-110' : 'border-white/20 hover:border-white/50'
                          }`}
                        >
                          <span className="w-full h-full rounded-full block border border-black/20" style={{ backgroundColor: c.hex || '#111' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/70">
                      Size: <span className="text-cream font-bold">{selectedSize || 'Select a size'}</span>
                    </p>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-xs tracking-wider uppercase text-lime hover:underline font-semibold"
                    >
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes?.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[48px] h-12 px-4 text-xs font-bold uppercase rounded border transition-all ${
                          selectedSize === s
                            ? 'border-lime bg-lime text-dark shadow-md scale-105'
                            : 'border-white/20 bg-white/5 text-cream/80 hover:border-white/50 hover:text-cream'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Size guide modal inline */}
                  {showSizeGuide && (
                    <div className="mt-4 p-5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3 text-lime">Size Chart (cm)</p>
                      <table className="w-full text-xs text-cream/70">
                        <thead>
                          <tr className="border-b border-white/10 text-cream/40">
                            {['Size', 'Chest', 'Waist', 'Hip'].map(h => <th key={h} className="text-left py-2 font-semibold uppercase">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ['XS', '84-88', '72-76', '88-92'],
                            ['S', '88-92', '76-80', '92-96'],
                            ['M', '92-96', '80-84', '96-100'],
                            ['L', '96-101', '84-89', '100-105'],
                            ['XL', '101-106', '89-94', '105-110'],
                            ['XXL', '106-112', '94-100', '110-116']
                          ].map(([s, ...d]) => (
                            <tr key={s} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2.5 font-bold text-cream">{s}</td>
                              {d.map((v, idx) => <td key={idx} className="py-2.5">{v}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/70 mb-3">Quantity</p>
                  <div className="flex items-center w-fit border border-white/20 rounded-lg overflow-hidden bg-white/5">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 text-cream text-lg hover:bg-white/10 transition-colors flex items-center justify-center">−</button>
                    <span className="w-12 h-11 text-cream text-sm font-bold flex items-center justify-center border-x border-white/10">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 text-cream text-lg hover:bg-white/10 transition-colors flex items-center justify-center">+</button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <button
                    id="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full py-4 bg-lime hover:bg-lime-dim text-dark hover:text-white font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                  </button>

                  {product.inStock && (
                    <button
                      id="buy-now-btn"
                      onClick={handleBuyNow}
                      className="w-full py-3.5 border border-white/20 hover:bg-white/10 text-cream font-semibold text-xs tracking-[0.2em] uppercase rounded-lg transition-all"
                    >
                      Buy Now
                    </button>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-full py-3 border rounded-lg transition-all text-xs font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 ${
                      isWishlisted(product.id)
                        ? 'border-lime text-lime bg-lime/10'
                        : 'border-white/15 text-cream/70 hover:border-white/30 hover:text-cream'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{isWishlisted(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>

                {/* Delivery Info Box (Seamless Dark Theme) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-5 mt-6">
                  <div className="flex items-start gap-3.5">
                    <svg className="text-lime mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-cream uppercase tracking-wider mb-1">Nationwide Delivery</p>
                      <p className="text-xs text-cream/60 leading-relaxed">{product.deliveryInfo || 'Standard delivery within 3–5 business days across Nigeria.'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews / Delivery ── */}
          <div className="mt-16 sm:mt-20 border-t border-white/10 pt-8">
            <div className="flex gap-2 sm:gap-4 border-b border-white/10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.reviews || 0})` },
                { id: 'delivery', label: 'Delivery & Returns' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-lime text-lime font-bold'
                      : 'border-transparent text-cream/40 hover:text-cream'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-8 max-w-3xl">
              {activeTab === 'description' && (
                <p className="text-cream/80 text-sm sm:text-base leading-relaxed font-light">{product.description}</p>
              )}

              {activeTab === 'specs' && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                  <table className="w-full text-xs sm:text-sm text-cream/80">
                    <tbody>
                      {product.specs && Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key} className="border-b border-white/5 last:border-none">
                          <td className="py-3 font-semibold uppercase text-cream/40 tracking-wider w-1/3">{key.replace(/_/g, ' ')}</td>
                          <td className="py-3 text-cream">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating summary */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-center sm:text-left">
                      <div className="font-playfair italic font-black text-4xl text-cream mb-1">{product.rating || 5.0}</div>
                      <StarRating rating={product.rating || 5} size={16} />
                      <p className="text-cream/40 text-xs mt-1">{product.reviews || 0} total reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map(n => (
                        <div key={n} className="flex items-center gap-3">
                          <span className="text-cream/40 text-xs w-4">{n}★</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-lime rounded-full" style={{ width: `${n === 5 ? 75 : n === 4 ? 18 : 7}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review items */}
                  <div className="divide-y divide-white/5">
                    {MOCK_REVIEWS.map(r => (
                      <div key={r.id} className="py-5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-cream text-sm font-semibold">{r.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={r.rating} size={12} />
                              <span className="text-cream/40 text-xs">{r.date}</span>
                              {r.verified && <span className="text-lime text-[0.65rem] tracking-wider uppercase font-bold">✓ Verified Purchase</span>}
                            </div>
                          </div>
                        </div>
                        <p className="text-cream/90 text-xs font-semibold mb-1">{r.title}</p>
                        <p className="text-cream/60 text-xs leading-relaxed">{r.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Write a review form */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-lg space-y-4">
                    <h3 className="font-bold text-xs tracking-[0.2em] uppercase text-cream">Write a Review</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewRating(n)}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= reviewRating ? '#C4622D' : 'none'} stroke="#C4622D" strokeWidth="1.5">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Share your feedback about fit, material, or style..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/15 text-cream text-xs p-4 rounded-lg focus:outline-none focus:border-lime resize-none placeholder:text-cream/30"
                    />
                    <button onClick={() => { showToast('Thank you! Your review has been submitted.'); setReviewText('') }} className="px-6 py-3 bg-lime text-dark font-bold text-xs uppercase tracking-wider rounded hover:bg-lime-dim hover:text-white transition-colors">
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-6 text-cream/70 text-xs sm:text-sm leading-relaxed">
                  <div>
                    <h4 className="text-cream font-bold text-xs tracking-[0.2em] uppercase mb-2">Nationwide Shipping</h4>
                    <p>Standard Shipping (3–5 business days) — ₦3,000<br/>Express Dispatch (1–2 business days) — ₦5,000</p>
                  </div>
                  <div>
                    <h4 className="text-cream font-bold text-xs tracking-[0.2em] uppercase mb-2">Returns & Exchanges</h4>
                    <p>We offer hassle-free size and product exchanges within 7 days of delivery. Items must be unworn with original brand tags attached.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-12">
              <h2 className="font-playfair italic font-black text-cream text-2xl sm:text-3xl mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {related.map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-3">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-cream text-xs font-semibold mb-1 group-hover:text-lime transition-colors">{p.name}</h3>
                    <span className="text-cream/60 text-xs font-medium">₦{p.price.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Recently Viewed ── */}
          {recentlyViewed.filter(p => p.id !== product.id).length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-12">
              <p className="eyebrow block mb-2">Browsing History</p>
              <h2 className="font-playfair italic font-black text-cream text-2xl sm:text-3xl mb-8">Recently Viewed</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {recentlyViewed.filter(p => p.id !== product.id).slice(0, 6).map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-2">
                      <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-cream text-xs font-medium truncate group-hover:text-lime transition-colors">{p.name}</h3>
                    <span className="text-cream/50 text-xs">₦{p.price.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Lightbox Modal ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[300] bg-dark/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-cream/70 hover:text-cream transition-colors z-10 p-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length) }}
            className="absolute left-4 sm:left-8 text-cream/70 hover:text-cream transition-colors z-10 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full bg-dark/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={product.images[lightboxIndex]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % product.images.length) }}
            className="absolute right-4 sm:right-8 text-cream/70 hover:text-cream transition-colors z-10 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full bg-dark/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}

      <Footer />
    </>
  )
}
