import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.floor(rating) ? '#968574' : 'none'} stroke="#968574" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  )
}

const MOCK_REVIEWS = [
  { id: 1, name: 'James L.', rating: 5, date: 'Apr 2025', title: 'Absolute quality', body: 'Couldn\'t be happier with this purchase. The material is incredibly premium and the fit is perfect. Will definitely buy again.', verified: true },
  { id: 2, name: 'Sarah M.', rating: 4, date: 'Mar 2025', title: 'Great product, sizing runs slightly large', body: 'Really happy with the quality. Just sizing up one note — I\'d recommend going a size down for a slim fit.', verified: true },
  { id: 3, name: 'Chris T.', rating: 5, date: 'Feb 2025', title: 'My new daily wear', body: 'I own multiple pieces from MK 1974 and this is another banger. Top tier brand.', verified: false },
]

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, addToCart, toggleWishlist, isWishlisted, showToast } = useApp()

  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug])

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  if (!product) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-cream/40 text-[0.85rem] tracking-[0.3em] uppercase mb-6">Product not found</p>
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
    addToCart(product, selectedSize, product.colors[selectedColor].name, qty)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { showToast('Please select a size', 'error'); return }
    addToCart(product, selectedSize, product.colors[selectedColor].name, qty)
    navigate('/checkout')
  }

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="px-8 md:px-12 py-4 border-b border-white/[0.05]">
          <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-[0.65rem] text-muted tracking-[0.15em] uppercase">
            <Link to="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-cream transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-cream">{product.name}</span>
          </div>
        </div>

        {/* Main product grid */}
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* ── Image Gallery ── */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-lime' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-surface2">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className={`text-[0.6rem] font-black tracking-[0.25em] uppercase px-3 py-1.5 ${
                      product.badge === 'Sale' ? 'bg-red-500 text-white' : 'bg-lime text-dark'
                    }`}>{product.badge}</span>
                  </div>
                )}
                {/* Mobile thumbnails */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-2 h-2 rounded-full transition-all ${selectedImage === i ? 'bg-lime' : 'bg-white/30'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Product Info ── */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="eyebrow mb-2">{product.category}</p>
                <h1 className="font-playfair font-black italic text-cream text-3xl md:text-4xl mb-3">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-cream text-[0.8rem] font-medium">{product.rating}</span>
                  <span className="text-muted text-[0.78rem]">({product.reviews} reviews)</span>
                  <span className={`text-[0.7rem] font-semibold tracking-[0.15em] uppercase ${product.inStock ? 'text-lime' : 'text-red-400'}`}>
                    {product.inStock ? '● In Stock' : '● Sold Out'}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-cream text-3xl font-light">₦{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-muted text-xl line-through">₦{product.originalPrice}</span>
                      <span className="text-lime text-[0.75rem] font-semibold">Save ₦{product.originalPrice - product.price}</span>
                    </>
                  )}
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <p className="text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-cream/60 mb-3">
                    Colour: <span className="text-cream">{product.colors[selectedColor].name}</span>
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(i)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === i ? 'border-lime scale-110' : 'border-transparent hover:border-white/40'}`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-cream/60">
                      Size: <span className="text-cream">{selectedSize || 'Select a size'}</span>
                    </p>
                    <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="text-[0.65rem] tracking-[0.15em] uppercase text-lime hover:text-lime-dim transition-colors border-b border-lime">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[44px] h-11 px-3 text-[0.72rem] font-medium border transition-all ${
                          selectedSize === s
                            ? 'border-lime text-lime bg-lime/10'
                            : 'border-white/20 text-cream/70 hover:border-white/50 hover:text-cream'
                        }`}
                      >{s}</button>
                    ))}
                  </div>

                  {/* Size guide panel */}
                  {showSizeGuide && (
                    <div className="mt-4 p-5 bg-surface2 border border-black/[0.08]">
                      <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#1A1A1A' }}>Size Guide (cm)</p>
                      <table className="w-full text-[0.72rem]" style={{ color: 'rgba(26,26,26,0.7)' }}>
                        <thead><tr className="border-b border-black/[0.08]">{['Size', 'Chest', 'Waist', 'Hip'].map(h => <th key={h} className="text-left py-2 font-normal" style={{ color: 'rgba(26,26,26,0.5)' }}>{h}</th>)}</tr></thead>
                        <tbody>
                          {[['XS','84-88','72-76','88-92'],['S','88-92','76-80','92-96'],['M','92-96','80-84','96-100'],['L','96-101','84-89','100-105'],['XL','101-106','89-94','105-110'],['XXL','106-112','94-100','110-116']].map(([s,...d]) => (
                            <tr key={s} className="border-b border-black/[0.04]">
                              <td className="py-2.5 font-semibold" style={{ color: '#1A1A1A' }}>{s}</td>
                              {d.map((v, i) => <td key={i} className="py-2.5">{v}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <p className="text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-cream/60 mb-3">Quantity</p>
                  <div className="flex items-center gap-0">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 border border-white/20 text-cream text-xl hover:border-white/40 transition-all flex items-center justify-center">−</button>
                    <span className="w-14 h-12 border-t border-b border-white/20 text-cream text-[0.88rem] font-medium flex items-center justify-center">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 border border-white/20 text-cream text-xl hover:border-white/40 transition-all flex items-center justify-center">+</button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    id="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    {product.inStock ? 'Add to Bag' : 'Sold Out'}
                  </button>
                  {product.inStock && (
                    <button id="buy-now-btn" onClick={handleBuyNow} className="btn-ghost w-full justify-center">
                      Buy Now
                    </button>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex items-center justify-center gap-2 w-full py-3.5 border transition-all text-[0.7rem] font-medium tracking-[0.2em] uppercase ${
                      isWishlisted(product.id) ? 'border-lime text-lime' : 'border-white/20 text-cream/60 hover:border-white/40 hover:text-cream'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {isWishlisted(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                {/* Delivery */}
                <div className="border border-black/[0.08] p-5 bg-surface2">
                  <div className="flex items-start gap-3">
                    <svg className="text-lime mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <p className="text-[0.78rem] leading-[1.7]" style={{ color: 'rgba(26,26,26,0.7)' }}>{product.deliveryInfo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews ── */}
          <div className="mt-20 border-t border-white/[0.05]">
            <div className="flex gap-0 border-b border-white/[0.05]">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.reviews})` },
                { id: 'delivery', label: 'Delivery & Returns' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-[0.68rem] font-semibold tracking-[0.25em] uppercase transition-all border-b-2 ${
                    activeTab === tab.id ? 'border-lime text-lime' : 'border-transparent text-cream/40 hover:text-cream'
                  }`}
                >{tab.label}</button>
              ))}
            </div>

            <div className="py-10 max-w-3xl">
              {activeTab === 'description' && (
                <p className="text-cream/70 text-[0.9rem] font-light leading-[1.9]">{product.description}</p>
              )}
              {activeTab === 'specs' && (
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key} className="border-b border-white/[0.05]">
                        <td className="py-3 text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-muted w-1/3">{key.replace(/_/g, ' ')}</td>
                        <td className="py-3 text-[0.85rem] text-cream/80">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-6 mb-8 p-6 bg-surface2 border border-black/[0.08]">
                    <div className="text-center">
                      <div className="font-playfair italic font-black text-5xl mb-1" style={{ color: '#1A1A1A' }}>{product.rating}</div>
                      <StarRating rating={product.rating} size={16} />
                      <p className="text-muted text-[0.7rem] mt-1">{product.reviews} reviews</p>
                    </div>
                    <div className="flex-1">
                      {[5,4,3,2,1].map(n => (
                        <div key={n} className="flex items-center gap-3 mb-1.5">
                          <span className="text-muted text-[0.65rem] w-4">{n}★</span>
                          <div className="flex-1 h-1.5 bg-surface">
                            <div className="h-full bg-lime" style={{ width: `${n === 5 ? 70 : n === 4 ? 20 : 5}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {MOCK_REVIEWS.map(r => (
                    <div key={r.id} className="border-b border-white/[0.05] py-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-cream text-[0.85rem] font-semibold">{r.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <StarRating rating={r.rating} size={12} />
                            <span className="text-muted text-[0.65rem]">{r.date}</span>
                            {r.verified && <span className="text-lime text-[0.6rem] tracking-[0.15em] uppercase">✓ Verified</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-cream/60 text-[0.78rem] font-medium mb-1">{r.title}</p>
                      <p className="text-cream/50 text-[0.82rem] font-light leading-[1.7]">{r.body}</p>
                    </div>
                  ))}

                  {/* Write a review */}
                  <div className="mt-8 p-6 bg-surface2 border border-black/[0.08]">
                    <h3 className="font-semibold text-[0.85rem] tracking-[0.15em] uppercase mb-5" style={{ color: '#1A1A1A' }}>Write a Review</h3>
                    <div className="flex items-center gap-2 mb-4">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setReviewRating(n)}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill={n <= reviewRating ? '#968574' : 'none'} stroke="#968574" strokeWidth="1.5">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="w-full bg-surface border border-black/10 text-onlight text-[0.82rem] p-4 focus:outline-none focus:border-lime/40 transition-colors resize-none placeholder-muted"
                    />
                    <button className="btn-primary mt-3">Submit Review</button>
                  </div>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="space-y-6 text-cream/70 text-[0.88rem] font-light leading-[1.9]">
                  <div><h4 className="text-cream font-semibold text-[0.82rem] tracking-[0.2em] uppercase mb-2">delivery</h4>
                    <p>Standard (3-5 days) — Free on orders over ₦75, otherwise ₦3.99<br/>Express (1-2 days) — ₦5.99<br/>Next Day (order before 2pm) — ₦8.99</p>
                  </div>
                  <div><h4 className="text-cream font-semibold text-[0.82rem] tracking-[0.2em] uppercase mb-2">International</h4>
                    <p>Europe — ₦12.99 (5-8 days)<br/>Rest of World — ₦18.99 (7-14 days)</p>
                  </div>
                  <div><h4 className="text-cream font-semibold text-[0.82rem] tracking-[0.2em] uppercase mb-2">Returns</h4>
                    <p>We offer free returns within 30 days. Items must be unworn, with tags attached. Start a return from your profile.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-white/[0.05] pt-16">
              <h2 className="font-playfair font-black italic text-cream text-3xl mb-10">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-surface2 mb-3">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-cream text-[0.82rem] font-medium mb-1">{p.name}</h3>
                    <span className="text-cream/60 text-[0.82rem]">₦{p.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
