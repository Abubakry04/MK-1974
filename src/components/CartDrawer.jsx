import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, cartCount } = useApp()
  const shipping = cartTotal >= 75 ? 0 : 3.99

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[150] bg-dark/70 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[160] w-full max-w-[420px] bg-surface flex flex-col transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.05]">
          <div>
            <p className="text-cream font-semibold text-[0.85rem] tracking-[0.1em]">Your Bag</p>
            {cartCount > 0 && <p className="text-muted text-[0.7rem] mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="text-cream/40 hover:text-cream transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <p className="text-cream/50 text-[0.78rem] tracking-[0.2em] uppercase mb-2">Your bag is empty</p>
                <p className="text-muted text-[0.72rem]">Add some items to get started</p>
              </div>
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-primary mt-2">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-white/[0.04]">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-4 py-5">
                  <Link to={`/product/${item.product.slug}`} onClick={() => setCartOpen(false)} className="shrink-0 w-20 aspect-[3/4] overflow-hidden bg-surface2">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Link to={`/product/${item.product.slug}`} onClick={() => setCartOpen(false)}>
                        <h3 className="text-cream text-[0.82rem] font-medium leading-tight hover:text-lime transition-colors">{item.product.name}</h3>
                      </Link>
                      <button onClick={() => removeFromCart(item.key)} className="text-muted hover:text-cream transition-colors shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-muted text-[0.68rem] mb-3">{item.size} · {item.color}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0">
                        <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-7 h-7 border border-white/15 text-cream hover:border-white/30 text-xs flex items-center justify-center transition-all">−</button>
                        <span className="w-8 h-7 border-t border-b border-white/15 text-cream text-[0.72rem] flex items-center justify-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-7 h-7 border border-white/15 text-cream hover:border-white/30 text-xs flex items-center justify-center transition-all">+</button>
                      </div>
                      <span className="text-cream text-[0.85rem] font-medium">£{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/[0.05] p-7">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-[0.78rem]">
                <span className="text-cream/60">Subtotal</span>
                <span className="text-cream">£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[0.78rem]">
                <span className="text-cream/60">Shipping</span>
                <span className={shipping === 0 ? 'text-lime' : 'text-cream'}>
                  {shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-muted text-[0.65rem]">
                  Add £{(75 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="flex justify-between pt-3 border-t border-white/[0.04]">
                <span className="text-cream font-semibold text-[0.82rem]">Estimated Total</span>
                <span className="text-cream font-semibold text-[0.88rem]">£{(cartTotal + shipping).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Checkout
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="btn-ghost w-full justify-center text-center"
              >
                View Full Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
