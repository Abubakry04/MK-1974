import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'

function UpsellCard({ product }) {
  const { addToCart } = useApp()
  return (
    <div className="flex gap-3 items-center py-3">
      <Link to={`/product/${product.slug}`} className="shrink-0 w-14 aspect-[3/4] overflow-hidden bg-surface2 rounded">
        <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-dark text-sm font-medium leading-tight truncate">{product.name}</p>
        <p className="text-dark/60 text-xs mt-0.5 font-medium">₦{product.price.toLocaleString()}</p>
      </div>
      <button
        onClick={() => addToCart(product, product.sizes?.[0], product.colors?.[0]?.name)}
        className="shrink-0 text-xs font-semibold border border-black/15 text-dark/80 px-3 py-1.5 hover:border-black hover:text-dark transition-colors whitespace-nowrap rounded"
      >
        Add
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, cartCount, products, user, showToast } = useApp()

  const upsellProducts = (() => {
    if (cart.length === 0 || products.length === 0) return []
    const cartProductIds = new Set(cart.map(i => i.product.id))
    const cartCategories = new Set(cart.map(i => i.product.category))
    const candidates = products.filter(p => !cartProductIds.has(p.id) && !cartCategories.has(p.category) && p.inStock)
    return (candidates.length > 0 ? candidates : products.filter(p => !cartProductIds.has(p.id) && p.inStock)).slice(0, 2)
  })()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[150] bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[160] w-full max-w-[400px] bg-white text-dark shadow-2xl flex flex-col transition-transform duration-400 border-l border-black/10 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <div>
            <p className="text-dark font-bold text-base">Your bag</p>
            {cartCount > 0 && <p className="text-dark/60 text-xs mt-0.5 font-medium">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>}
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close" className="text-dark/60 hover:text-dark transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-dark/50">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div>
                <p className="text-dark font-semibold text-base mb-1">Your bag is empty</p>
                <p className="text-dark/60 text-xs">Add some items to get started</p>
              </div>
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-primary mt-1">Browse shop</Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-black/10">
                {cart.map((item) => {
                  const freshProduct = products.find(p => p.id === item.product.id) || item.product
                  return (
                    <div key={item.key} className="flex gap-4 py-5">
                      <Link to={`/product/${freshProduct.slug}`} onClick={() => setCartOpen(false)} className="shrink-0 w-20 aspect-[3/4] rounded overflow-hidden bg-surface2">
                        <img src={freshProduct.images?.[0] || ''} alt={freshProduct.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link to={`/product/${freshProduct.slug}`} onClick={() => setCartOpen(false)}>
                            <h3 className="text-dark text-sm font-semibold leading-tight hover:text-accent transition-colors">{freshProduct.name}</h3>
                          </Link>
                          <button onClick={() => removeFromCart(item.key)} className="text-dark/40 hover:text-dark transition-colors shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-dark/60 text-xs mb-3 font-medium">{item.size} · {item.color}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button onClick={() => updateQty(item.key, item.qty - 1)} className="w-7 h-7 border border-black/15 text-dark hover:border-black text-sm flex items-center justify-center transition-colors rounded-l">−</button>
                            <span className="w-8 h-7 border-t border-b border-black/15 text-dark text-xs flex items-center justify-center font-bold">{item.qty}</span>
                            <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-7 h-7 border border-black/15 text-dark hover:border-black text-sm flex items-center justify-center transition-colors rounded-r">+</button>
                          </div>
                          <span className="text-dark text-sm font-bold">₦{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {upsellProducts.length > 0 && (
                <div className="mt-5 pt-5 border-t border-black/10">
                  <p className="text-dark/70 text-xs font-bold uppercase tracking-wider mb-2">You might also like</p>
                  <div className="divide-y divide-black/10">
                    {upsellProducts.map(p => <UpsellCard key={p.id} product={p} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-black/10 p-6 bg-surface">
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-dark/60 font-medium">Subtotal</span>
                <span className="text-dark font-medium">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-black/10 mt-2">
                <span className="text-dark font-bold">Total</span>
                <span className="text-dark font-bold">₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {user ? (
                <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full justify-center">
                  Checkout
                </Link>
              ) : (
                <Link
                  to="/auth?mode=register&redirect=/checkout"
                  onClick={() => { showToast('Sign in to continue to checkout.'); setCartOpen(false) }}
                  className="btn-primary w-full justify-center"
                >
                  Sign in to checkout
                </Link>
              )}
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-ghost w-full justify-center text-center">
                View bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
