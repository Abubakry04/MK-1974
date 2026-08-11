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
  const [productReviews, setProductReviews] = useState(() => {
    try {
      const stored = localStorage.getItem(`mk_reviews_${product?.id}`)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (product?.id) {
      try {
        const stored = localStorage.getItem(`mk_reviews_${product.id}`)
        setProductReviews(stored ? JSON.parse(stored) : [])
      } catch { setProductReviews([]) }
    }
  }, [product?.id])

  const handleAddReview = () => {
    if (!reviewText.trim()) { showToast('Please write a review before submitting.', 'error'); return; }
    const newRev = {
      id: Date.now(),
      name: user ? `${user.firstName} ${user.lastName}` : 'Customer',
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      body: reviewText.trim(),
      verified: true
    }
    const updated = [newRev, ...productReviews]
    setProductReviews(updated)
    try { localStorage.setItem(`mk_reviews_${product.id}`, JSON.stringify(updated)) } catch {}
    setReviewText('')
    showToast('Thank you! Your review has been submitted.')
  }

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
        <div className="min-h-screen bg-surface flex items-center justify-center px-6 text-dark">
          <div className="text-center max-w-md py-20">
            <p className="text-dark/60 text-xs tracking-[0.3em] uppercase mb-6 font-bold">Product not found</p>
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
      <main className="bg-surface min-h-screen pt-24 sm:pt-28 pb-24 text-dark">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-8 md:px-12 py-4 border-b border-black/10">
          <div className="max-w-[1320px] mx-auto flex items-center gap-2 text-[0.68rem] text-dark/60 font-semibold tracking-[0.15em] uppercase">
            <Link to="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-dark transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-dark font-extrabold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
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
                        selectedImage === i ? 'border-dark ring-2 ring-black/15 scale-105' : 'border-black/10 hover:border-black/30 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Container */}
              <div className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-black/10 shadow-lg group cursor-zoom-in">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0] || ''}
                  alt={product.name}
                  onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true) }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`text-[0.65rem] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded shadow ${
                      product.badge === 'Sale' ? 'bg-red-600 text-white' : 'bg-dark text-cream'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Zoom hint button */}
                <button
                  onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true) }}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-black/15 text-dark text-[0.65rem] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-dark hover:text-cream transition-colors shadow-sm"
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
                <h1 className="font-playfair italic font-black text-dark text-3xl sm:text-4xl leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <StarRating rating={product.rating || 5} />
                  <span className="text-dark text-xs font-bold">{product.rating || 5.0}</span>
                  <span className="text-dark/60 text-xs font-medium">({product.reviews || 0} reviews)</span>
                  <span className="text-dark/20">•</span>
                  <span className={`text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 ${product.inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                    <span className="w-2 h-2 rounded-full bg-current inline-block" />
                    {product.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-dark text-3xl sm:text-4xl font-black tracking-tight">₦{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-dark/40 text-lg sm:text-xl line-through font-medium">₦{product.originalPrice.toLocaleString()}</span>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded">
                        Save ₦{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-dark/70 mb-3">
                      Colour: <span className="text-dark font-extrabold">{product.colors?.[selectedColor]?.name || ''}</span>
                    </p>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c, i) => (
                        <button
                          key={c.name || i}
                          onClick={() => setSelectedColor(i)}
                          title={c.name}
                          className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                            selectedColor === i ? 'border-dark ring-2 ring-black/20 scale-110' : 'border-black/20 hover:border-black/50'
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
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-dark/70">
                      Size: <span className="text-dark font-extrabold">{selectedSize || 'Select a size'}</span>
                    </p>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-xs tracking-wider uppercase text-dark hover:underline font-bold"
                    >
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes?.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[48px] h-12 px-4 text-xs font-extrabold uppercase rounded-lg border transition-all ${
                          selectedSize === s
                            ? 'border-dark bg-dark text-cream shadow-md scale-105'
                            : 'border-black/15 bg-white text-dark/80 hover:border-dark hover:text-dark'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Size guide modal inline */}
                  {showSizeGuide && (
                    <div className="mt-4 p-5 bg-white border border-black/10 rounded-xl shadow-md">
                      <p className="text-xs font-extrabold tracking-[0.2em] uppercase mb-3 text-dark">Size Chart (cm)</p>
                      <table className="w-full text-xs text-dark/80">
                        <thead>
                          <tr className="border-b border-black/10 text-dark/50">
                            {['Size', 'Chest', 'Waist', 'Hip'].map(h => <th key={h} className="text-left py-2 font-bold uppercase">{h}</th>)}
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
                            <tr key={s} className="border-b border-black/10 hover:bg-stone-100 font-medium">
                              <td className="py-2.5 font-bold text-dark">{s}</td>
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
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-dark/70 mb-3">Quantity</p>
                  <div className="flex items-center w-fit border border-black/15 rounded-lg overflow-hidden bg-white">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 text-dark text-lg font-bold hover:bg-stone-100 transition-colors flex items-center justify-center">−</button>
                    <span className="w-12 h-11 text-dark text-sm font-black flex items-center justify-center border-x border-black/10 bg-stone-100">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 text-dark text-lg font-bold hover:bg-stone-100 transition-colors flex items-center justify-center">+</button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <button
                    id="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full py-4 bg-dark hover:bg-accent text-cream font-bold text-xs tracking-[0.2em] uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                  </button>

                  {product.inStock && (
                    <button
                      id="buy-now-btn"
                      onClick={handleBuyNow}
                      className="w-full py-3.5 border border-black/20 hover:bg-dark hover:text-cream text-dark font-bold text-xs tracking-[0.2em] uppercase rounded-lg transition-all"
                    >
                      Buy Now
                    </button>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-full py-3 border rounded-lg transition-all text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 ${
                      isWishlisted(product.id)
                        ? 'border-dark text-dark bg-stone-100'
                        : 'border-black/15 text-dark/70 hover:border-dark hover:text-dark'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{isWishlisted(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>

                {/* Delivery Info Box */}
                <div className="bg-white border border-black/10 rounded-xl p-4 sm:p-5 mt-6 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <svg className="text-dark mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Nationwide Delivery</p>
                      <p className="text-xs text-dark/60 leading-relaxed font-medium">{product.deliveryInfo || 'Standard delivery within 3–5 business days across Nigeria.'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Info Dropdown: Description / Specs / Reviews / Delivery ── */}
          <div className="mt-16 sm:mt-20 border-t border-black/10 pt-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <label htmlFor="product-info-dropdown" className="text-xs font-black tracking-[0.2em] uppercase text-dark/60">
                Product Details & Information
              </label>
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <select
                  id="product-info-dropdown"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-white border border-black/15 text-dark text-xs font-extrabold tracking-[0.15em] uppercase px-5 py-3.5 rounded-xl shadow-sm appearance-none focus:outline-none focus:border-dark focus:ring-2 focus:ring-black/10 cursor-pointer pr-10 transition-all"
                >
                  <option value="description">Description</option>
                  <option value="specs">Specifications</option>
                  <option value="reviews">Reviews ({product.reviews || 0})</option>
                  <option value="delivery">Delivery & Returns</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark/70">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="py-8 max-w-3xl">
              {activeTab === 'description' && (
                <p className="text-dark/80 text-sm sm:text-base leading-relaxed font-medium">{product.description}</p>
              )}

              {activeTab === 'specs' && (
                <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm">
                  <table className="w-full text-xs sm:text-sm text-dark/80 font-medium">
                    <tbody>
                      {product.specs && Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key} className="border-b border-black/10 last:border-none">
                          <td className="py-3 font-bold uppercase text-dark/50 tracking-wider w-1/3">{key.replace(/_/g, ' ')}</td>
                          <td className="py-3 text-dark font-bold">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating summary */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-black/10 rounded-xl shadow-sm">
                    <div className="text-center sm:text-left">
                      <div className="font-playfair italic font-black text-4xl text-dark mb-1">{product.rating || 5.0}</div>
                      <StarRating rating={product.rating || 5} size={16} />
                      <p className="text-dark/60 text-xs mt-1 font-medium">{product.reviews || 0} total reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map(n => (
                        <div key={n} className="flex items-center gap-3">
                          <span className="text-dark/60 text-xs w-4 font-bold">{n}★</span>
                          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div className="h-full bg-dark rounded-full" style={{ width: `${n === 5 ? 75 : n === 4 ? 18 : 7}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review items */}
                  {productReviews.length > 0 ? (
                    <div className="divide-y divide-black/10">
                      {productReviews.map(r => (
                        <div key={r.id} className="py-5">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-dark text-sm font-bold">{r.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StarRating rating={r.rating} size={12} />
                                <span className="text-dark/50 text-xs">{r.date}</span>
                                {r.verified && <span className="text-dark text-[0.65rem] tracking-wider uppercase font-bold">✓ Verified Purchase</span>}
                              </div>
                            </div>
                          </div>
                          <p className="text-dark/80 text-xs leading-relaxed font-medium">{r.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border border-black/10 rounded-xl bg-white shadow-xs">
                      <p className="text-dark/50 text-xs tracking-widest uppercase font-bold mb-1">No reviews yet</p>
                      <p className="text-dark/70 text-xs font-medium">Be the first to review this product!</p>
                    </div>
                  )}

                  {/* Write a review form */}
                  <div className="p-6 bg-white border border-black/10 rounded-xl space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-xs tracking-[0.2em] uppercase text-dark">Write a Review</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewRating(n)}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= reviewRating ? '#111111' : 'none'} stroke="#111111" strokeWidth="1.5">
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
                      className="w-full bg-surface border border-black/15 text-dark text-xs p-4 rounded-lg focus:outline-none focus:border-dark resize-none placeholder:text-dark/40 font-medium"
                    />
                    <button onClick={handleAddReview} className="px-6 py-3 bg-dark text-cream font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-accent transition-colors">
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-6 text-dark/80 text-xs sm:text-sm leading-relaxed font-medium">
                  <div>
                    <h4 className="text-dark font-extrabold text-xs tracking-[0.2em] uppercase mb-2">Nationwide Shipping</h4>
                    <p>Standard Shipping (3–5 business days) — ₦3,500<br/>Express Dispatch (1–2 business days) — ₦5,500</p>
                  </div>
                  <div>
                    <h4 className="text-dark font-extrabold text-xs tracking-[0.2em] uppercase mb-2">Returns & Exchanges</h4>
                    <p>We offer hassle-free size and product exchanges within 7 days of delivery. Items must be unworn with original brand tags attached.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-black/10 pt-12">
              <h2 className="font-playfair italic font-black text-dark text-2xl sm:text-3xl mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {related.map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface2 border border-black/10 mb-3">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-dark text-xs font-bold mb-1 group-hover:text-accent transition-colors">{p.name}</h3>
                    <span className="text-dark/80 text-xs font-black">₦{p.price.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Recently Viewed ── */}
          {recentlyViewed.filter(p => p.id !== product.id).length > 0 && (
            <div className="mt-16 border-t border-black/10 pt-12">
              <p className="eyebrow block mb-2">Browsing History</p>
              <h2 className="font-playfair italic font-black text-dark text-2xl sm:text-3xl mb-8">Recently Viewed</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {recentlyViewed.filter(p => p.id !== product.id).slice(0, 6).map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface2 border border-black/10 mb-2">
                      <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-dark text-xs font-bold truncate group-hover:text-accent transition-colors">{p.name}</h3>
                    <span className="text-dark/70 text-xs font-bold">₦{p.price.toLocaleString()}</span>
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
