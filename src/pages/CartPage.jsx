import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const STANDARD_SHIPPING_FEE = 3500

const PROMO_CODES = {
  'MK10': { code: 'MK10', discountPercent: 10, description: '10% off your order' },
  'LAUNCH2026': { code: 'LAUNCH2026', discountPercent: 15, description: '15% launch discount' },
  'WELCOME': { code: 'WELCOME', discountPercent: 10, description: '10% welcome discount' },
}

export default function CartPage() {
  usePageMeta('Your Shopping Bag — MK 1974', 'Review and edit items in your MK 1974 shopping bag.')
  const { cart, removeFromCart, updateQty, cartTotal, showToast, products, user, toggleWishlist, isWishlisted, addToCart } = useApp()
  const navigate = useNavigate()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  const shippingFee = cart.length === 0 ? 0 : STANDARD_SHIPPING_FEE

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0
    return Math.round((cartTotal * appliedPromo.discountPercent) / 100)
  }, [cartTotal, appliedPromo])

  const grandTotal = Math.max(0, cartTotal - discountAmount + shippingFee)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    const cleanCode = promoInput.trim().toUpperCase()
    if (!cleanCode) return

    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(PROMO_CODES[cleanCode])
      showToast(`Promo code "${cleanCode}" applied! Saved ${PROMO_CODES[cleanCode].discountPercent}%`)
      setPromoInput('')
    } else {
      setPromoError('Invalid promo code. Try MK10 or LAUNCH2026')
      showToast('Invalid promo code', 'error')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    showToast('Promo code removed')
  }

  // Recommended products (excluding ones already in cart)
  const recommendedProducts = useMemo(() => {
    const inCartIds = new Set(cart.map(i => i.product.id))
    return products.filter(p => !inCartIds.has(p.id)).slice(0, 4)
  }, [cart, products])

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-24 pb-20">
        {/* Page Header */}
        <div className="border-b border-white/[0.06] bg-surface2/5 py-8 px-6 sm:px-10">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow block mb-1">Shopping Bag</span>
              <h1 className="text-3xl md:text-4xl font-bold text-cream">Your items</h1>
            </div>
            <Link to="/shop" className="text-xs text-muted hover:text-cream tracking-[0.15em] uppercase transition-colors flex items-center gap-2">
              ← Continue shopping
            </Link>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-8">
          {cart.length === 0 ? (
            /* ── EMPTY BAG STATE ── */
            <div className="py-20 text-center max-w-[540px] mx-auto">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-cream/50">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-cream mb-2">Your bag is currently empty</h2>
              <p className="text-cream/40 text-sm leading-relaxed mb-8">
                Looks like you haven't added anything to your shopping bag yet. Explore our latest drops and streetwear collections.
              </p>

              {/* Quick links */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {[
                  { label: 'Tracksuits', to: '/shop?category=tracksuits' },
                  { label: 'Joggers', to: '/shop?category=joggers' },
                  { label: 'Hoodies', to: '/shop?category=hoodies' },
                  { label: 'New Arrivals', to: '/shop?sort=newest' },
                ].map(c => (
                  <Link key={c.label} to={c.to} className="text-xs text-cream/70 hover:text-cream bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:border-lime/40 transition-colors">
                    {c.label}
                  </Link>
                ))}
              </div>

              <Link to="/shop" className="btn-primary">
                Explore Collection
              </Link>
            </div>
          ) : (
            /* ── FILLED BAG LAYOUT ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* LEFT COLUMN: Items */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">

                {/* Bag Items List */}
                <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
                  {cart.map(item => {
                    const freshProduct = products.find(p => p.id === item.product.id) || item.product
                    const mainImage = freshProduct.images?.[0] || '/product2.png'
                    const wishlisted = isWishlisted(freshProduct.id)

                    return (
                      <div key={item.key} className="py-6 flex flex-col sm:flex-row gap-5 items-start">
                        {/* Image */}
                        <Link to={`/product/${freshProduct.slug}`} className="shrink-0 w-24 sm:w-28 aspect-[3/4] bg-surface2 rounded overflow-hidden relative group">
                          <img src={mainImage} alt={freshProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {freshProduct.badge && (
                            <span className="absolute top-2 left-2 bg-dark/90 text-cream text-[0.55rem] font-bold px-1.5 py-0.5 rounded">
                              {freshProduct.badge}
                            </span>
                          )}
                        </Link>

                        {/* Item Info & Controls */}
                        <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <Link to={`/product/${freshProduct.slug}`} className="group">
                                <h3 className="text-cream font-medium text-base group-hover:text-lime transition-colors leading-tight">
                                  {freshProduct.name}
                                </h3>
                              </Link>
                              <span className="text-cream font-bold text-base shrink-0">
                                ₦{(item.price * item.qty).toLocaleString()}
                              </span>
                            </div>

                            {/* Details (Size, Color) */}
                            <div className="flex items-center gap-3 text-xs text-cream/50 mb-3">
                              <span>Size: <strong className="text-cream font-semibold">{item.size}</strong></span>
                              <span>·</span>
                              <span>Colour: <strong className="text-cream font-semibold">{item.color}</strong></span>
                              <span>·</span>
                              <span>Unit: ₦{item.price.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Controls Row: Qty Picker & Action Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            {/* Quantity Picker */}
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                className="w-8 h-8 border border-white/15 text-cream/70 hover:text-cream hover:border-white/40 transition-colors flex items-center justify-center text-sm rounded-l"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-10 h-8 border-t border-b border-white/15 text-cream text-xs font-semibold flex items-center justify-center bg-white/5">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="w-8 h-8 border border-white/15 text-cream/70 hover:text-cream hover:border-white/40 transition-colors flex items-center justify-center text-sm rounded-r"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Actions (Wishlist & Remove) */}
                            <div className="flex items-center gap-4 text-xs">
                              <button
                                onClick={() => {
                                  toggleWishlist(freshProduct.id)
                                  showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
                                }}
                                className={`flex items-center gap-1.5 transition-colors ${
                                  wishlisted ? 'text-red-400' : 'text-cream/50 hover:text-cream'
                                }`}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                                <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Save for later'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  removeFromCart(item.key)
                                  showToast(`${freshProduct.name} removed from bag`)
                                }}
                                className="text-cream/40 hover:text-red-400 transition-colors flex items-center gap-1"
                                aria-label="Remove item"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Back to shop link */}
                <div className="pt-2">
                  <Link to="/shop" className="text-xs text-lime hover:underline tracking-widest uppercase font-semibold">
                    ← Add more items to bag
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Order Summary Card */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-surface/10 border border-white/10 p-6 sm:p-8 rounded-lg sticky top-28 backdrop-blur-sm">
                  <h2 className="text-cream font-bold text-lg tracking-wider uppercase mb-6 pb-3 border-b border-white/10">
                    Order Summary
                  </h2>

                  {/* Price breakdown */}
                  <div className="space-y-3.5 mb-6 text-sm">
                    <div className="flex justify-between items-center text-cream/70">
                      <span>Bag Subtotal ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
                      <span className="text-cream font-medium">₦{cartTotal.toLocaleString()}</span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between items-center text-lime">
                        <span className="flex items-center gap-1.5">
                          Promo ({appliedPromo.code})
                          <button onClick={handleRemovePromo} className="text-cream/40 hover:text-red-400 text-xs">✕</button>
                        </span>
                        <span className="font-semibold">-₦{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-cream/70">
                      <span>Estimated Shipping</span>
                      <span className="text-cream font-medium">
                        ₦{shippingFee.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[0.72rem] text-cream/40 leading-normal">
                      Standard delivery fee within Nigeria: ₦{STANDARD_SHIPPING_FEE.toLocaleString()}.
                    </p>
                  </div>

                  {/* Promo Code Form */}
                  <div className="mb-6">
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. MK10)"
                        className="flex-1 bg-white/5 border border-white/15 text-cream placeholder-cream/30 text-xs px-3.5 py-2.5 rounded focus:outline-none focus:border-lime transition-colors uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-white/10 border border-white/20 text-cream text-xs font-semibold tracking-wider uppercase rounded hover:bg-lime hover:text-dark hover:border-lime transition-all"
                      >
                        Apply
                      </button>
                    </form>
                    {promoError && (
                      <p className="text-red-400 text-[0.7rem] mt-1.5">{promoError}</p>
                    )}
                    {appliedPromo && (
                      <p className="text-lime text-[0.72rem] mt-1.5 font-medium">✓ {appliedPromo.description} applied</p>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="border-t border-b border-white/10 py-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-cream font-bold text-base uppercase">Total</span>
                      <div className="text-right">
                        <span className="text-cream font-bold text-2xl">₦{grandTotal.toLocaleString()}</span>
                        <p className="text-[0.65rem] text-cream/40 uppercase tracking-wider mt-0.5">Includes taxes & duties</p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  {user ? (
                    <button
                      onClick={() => navigate('/checkout')}
                      className="btn-primary w-full justify-center py-4 text-sm"
                    >
                      Proceed to Checkout →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        showToast('Sign in to complete your purchase.')
                        navigate('/auth?mode=register&redirect=/checkout')
                      }}
                      className="btn-primary w-full justify-center py-4 text-sm"
                    >
                      Sign in to Checkout →
                    </button>
                  )}

                  {/* Guarantees */}
                  <div className="mt-6 pt-5 border-t border-white/5 space-y-2 text-[0.72rem] text-cream/50">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Free 30-day returns & exchanges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span>Secure Bank Transfer & Card Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <span>100% Authentic Lagos Streetwear</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ── RECOMMENDED / COMPLETE THE LOOK SECTION ── */}
          {recommendedProducts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-white/[0.08]">
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <span className="eyebrow block mb-1">Pair it up</span>
                  <h2 className="text-2xl font-bold text-cream">Complete your look</h2>
                </div>
                <Link to="/shop" className="text-xs text-muted hover:text-cream transition-colors">
                  View all products →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {recommendedProducts.map(p => (
                  <div key={p.id} className="group flex flex-col justify-between bg-white/5 border border-white/5 p-3 rounded hover:border-white/20 transition-all">
                    <div>
                      <Link to={`/product/${p.slug}`} className="block aspect-[3/4] bg-surface2 rounded overflow-hidden mb-3">
                        <img src={p.images?.[0] || '/product1.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      <Link to={`/product/${p.slug}`}>
                        <h3 className="text-cream text-xs sm:text-sm font-medium hover:text-lime transition-colors leading-tight line-clamp-1 mb-1">{p.name}</h3>
                      </Link>
                      <p className="text-cream/70 text-xs font-semibold">₦{p.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0]?.name || 'Standard')
                        showToast(`${p.name} added to bag`)
                      }}
                      className="mt-3 w-full bg-white/10 text-cream text-[0.7rem] font-bold tracking-wider uppercase py-2 hover:bg-lime hover:text-dark transition-colors rounded"
                    >
                      + Quick Add
                    </button>
                  </div>
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
