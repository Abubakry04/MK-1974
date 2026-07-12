import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

// ─── Cart Page ─────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, showToast, products } = useApp()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')

  const shipping = cartTotal >= 75 ? 0 : 3.99

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-24 px-8 md:px-12">
        <div className="max-w-[1200px] mx-auto py-12">
          <div className="mb-10">
            <p className="eyebrow mb-2">Your Selection</p>
            <h1 className="font-playfair font-black italic text-cream text-4xl md:text-5xl">Shopping Bag</h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="text-cream/40 text-[0.88rem] tracking-[0.2em] uppercase mb-8">Your bag is empty</p>
              <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2 space-y-0 divide-y divide-white/[0.05]">
                {cart.map(item => {
                  const freshProduct = products.find(p => p.id === item.product.id) || item.product
                  return (
                    <div key={item.key} className="flex gap-6 py-8">
                      <Link to={`/product/${freshProduct.slug}`} className="shrink-0 w-28 md:w-36 aspect-[3/4] overflow-hidden bg-surface2">
                        <img src={freshProduct.images?.[0] || '/product2.png'} alt={freshProduct.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link to={`/product/${freshProduct.slug}`}>
                                <h3 className="text-cream font-medium text-[0.95rem] hover:text-lime transition-colors">{freshProduct.name}</h3>
                              </Link>
                              <p className="text-muted text-[0.75rem] mt-1">Size: {item.size} · {item.color}</p>
                            </div>
                          <button onClick={() => removeFromCart(item.key)} className="text-muted hover:text-cream transition-colors ml-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Qty */}
                        <div className="flex items-center gap-0">
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-9 h-9 border border-white/15 text-cream hover:border-white/30 transition-all flex items-center justify-center text-sm">−</button>
                          <span className="w-10 h-9 border-t border-b border-white/15 text-cream text-[0.82rem] flex items-center justify-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-9 h-9 border border-white/15 text-cream hover:border-white/30 transition-all flex items-center justify-center text-sm">+</button>
                        </div>
                        <span className="text-cream font-medium text-[0.95rem]">₦{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )})}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-surface2 border border-black/[0.08] p-6 sticky top-28">
                  <h2 className="font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-6" style={{ color: '#1A1A1A' }}>Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[0.82rem]">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium" style={{ color: '#1A1A1A' }}>₦{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[0.82rem]">
                      <span className="text-muted">Delivery</span>
                      <span className={shipping === 0 ? 'text-lime font-medium' : 'font-medium'} style={shipping > 0 ? { color: '#1A1A1A' } : undefined}>{shipping === 0 ? 'FREE' : `₦${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-muted text-[0.68rem]">Add ₦{(75 - cartTotal).toFixed(2)} more for free shipping</p>
                    )}
                  </div>

                  {/* Coupon */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 bg-surface border border-black/10 text-onlight text-[0.78rem] px-3 py-2.5 focus:outline-none focus:border-lime/40"
                      />
                      <button
                        onClick={() => showToast('Invalid or expired coupon code', 'error')}
                        className="px-4 border border-black/20 text-muted text-[0.72rem] tracking-[0.15em] uppercase hover:border-black/40 hover:text-onlight transition-all"
                      >Apply</button>
                    </div>
                  </div>

                  <div className="border-t border-black/[0.08] pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[0.88rem]" style={{ color: '#1A1A1A' }}>Total</span>
                      <span className="font-semibold text-[0.95rem]" style={{ color: '#1A1A1A' }}>₦{(cartTotal + shipping).toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={() => navigate('/checkout')} className="btn-primary w-full justify-center">
                    Proceed to Checkout
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>

                  <Link to="/shop" className="block text-center text-muted text-[0.7rem] tracking-[0.15em] uppercase mt-4 hover:text-lime transition-colors">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
