import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const NIGERIAN_STATES = ['Lagos'
]

const STEPS = ['Details', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder, user, products } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [receipt, setReceipt] = useState(null)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    lga: '',
    delivery: 'standard',
  })

  const shipping = cartTotal >= 75 ? 0 : form.delivery === 'express' ? 5.99 : 3.99
  const total = cartTotal + shipping

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleStep1 = e => {
    e.preventDefault()
    setStep(1)
  }

  const handleReceiptUpload = e => {
    const file = e.target.files[0]
    if (file) setReceipt(file.name)
  }

  const handlePlaceOrder = () => {
    const order = placeOrder({ ...form, shipping })
    navigate(`/order-tracking/${order.id}`)
  }

  if (cart.length === 0) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <div className="text-center">
            <p className="text-cream/40 mb-6">Your bag is empty.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">Shop Now</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-24 px-8 md:px-12">
        <div className="max-w-[1100px] mx-auto py-12">
          {/* Header */}
          <div className="mb-10">
            <p className="eyebrow mb-2">Secure Checkout</p>
            <h1 className="font-playfair font-black italic text-cream text-4xl">Checkout</h1>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-3 ${i <= step ? 'text-lime' : 'text-muted'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center text-[0.7rem] font-bold border transition-all ${
                    i < step ? 'border-lime bg-lime text-dark' : i === step ? 'border-lime text-lime' : 'border-white/20 text-muted'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-12 md:w-24 h-[1px] mx-3 ${i < step ? 'bg-lime' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form area */}
            <div className="lg:col-span-2">
              {/* Step 0: Customer Details */}
              {step === 0 && (
                <form onSubmit={handleStep1} className="space-y-6">
                  <div>
                    <h2 className="text-cream font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-5">Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'firstName', label: 'First Name', type: 'text' },
                        { name: 'lastName', label: 'Last Name', type: 'text' },
                        { name: 'email', label: 'Email Address', type: 'email' },
                        { name: 'phone', label: 'Phone Number', type: 'tel' },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            name={f.name}
                            value={form[f.name]}
                            onChange={handleChange}
                            required
                            className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-cream font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-5">Delivery Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">Street Address</label>
                        <input name="address" value={form.address} onChange={handleChange} required className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">City</label>
                          <input name="city" value={form.city} onChange={handleChange} required className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40" />
                        </div>
                        <div>
                          <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">LGA</label>
                          <input name="lga" value={form.lga} onChange={handleChange} className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-2">State</label>
                        <select name="state" value={form.state} onChange={handleChange} required className="w-full bg-surface border border-black/10 text-onlight text-[0.85rem] px-4 py-3 focus:outline-none focus:border-lime/40 appearance-none">
                          <option value="">Select State</option>
                          {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* <div>
                    <h2 className="text-cream font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-5">Delivery Option</h2>
                    <div className="space-y-3">
                      {[
                        { value: 'standard', label: 'Standard Delivery', desc: '3-5 business days', price: cartTotal >= 75 ? 'FREE' : '₦3.99' },
                        { value: 'express', label: 'Express Delivery', desc: '1-2 business days', price: '₦5.99' },
                        { value: 'next-day', label: 'Next Day Delivery', desc: 'Order before 2pm', price: '₦8.99' },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${form.delivery === opt.value ? 'border-lime bg-lime/5' : 'border-white/10 hover:border-white/20'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.delivery === opt.value ? 'border-lime' : 'border-white/30'}`}>
                              {form.delivery === opt.value && <div className="w-2 h-2 rounded-full bg-lime" />}
                            </div>
                            <div>
                              <p className="text-cream text-[0.85rem] font-medium">{opt.label}</p>
                              <p className="text-muted text-[0.72rem]">{opt.desc}</p>
                            </div>
                          </div>
                          <input type="radio" name="delivery" value={opt.value} checked={form.delivery === opt.value} onChange={handleChange} className="hidden" />
                          <span className={`text-[0.85rem] font-semibold ${opt.price === 'FREE' ? 'text-lime' : 'text-cream'}`}>{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div> */}

                  <button type="submit" className="btn-primary">
                    Continue to Payment
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </form>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="bg-surface2 border border-black/[0.08] p-6">
                    <h2 className="font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-5" style={{ color: '#1A1A1A' }}>Bank Transfer Details</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Bank Name', value: 'Guaranty Trust Bank (GTBank)' },
                        { label: 'Account Name', value: 'MK 1974 Limited' },
                        { label: 'Account Number', value: '0123456789' },
                        { label: 'Amount to Pay', value: `₦${total.toFixed(2)}` },
                        { label: 'Reference', value: `MK${Date.now().toString().slice(-6)}` },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-3 border-b border-black/[0.08]">
                          <span className="text-muted text-[0.75rem] tracking-[0.15em] uppercase">{row.label}</span>
                          <span className="text-[0.9rem] font-semibold" style={row.label === 'Amount to Pay' ? { color: '#968574' } : { color: '#1A1A1A' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted text-[0.72rem] mt-4 leading-[1.7]">
                      Please use your order reference as the payment narration/description when making the transfer.
                    </p>
                  </div>

                  {/* Upload receipt */}
                  <div className="bg-surface2 border border-black/[0.08] p-6">
                    <h2 className="font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-4" style={{ color: '#1A1A1A' }}>I've Made Payment — Upload Receipt</h2>
                    <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed cursor-pointer transition-all ${receipt ? 'border-lime/50 bg-lime/5' : 'border-black/10 hover:border-black/20'}`}>
                      <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
                      {receipt ? (
                        <div className="text-center">
                          <svg className="text-lime mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <p className="text-lime text-[0.78rem] font-medium">{receipt}</p>
                          <p className="text-muted text-[0.65rem] mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="text-muted mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p className="text-muted text-[0.78rem]">Upload payment receipt</p>
                          <p className="text-muted text-[0.65rem] mt-1">JPG, PNG or PDF</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(0)} className="btn-ghost">← Back</button>
                    <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Confirm */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-surface2 border border-black/[0.08] p-6">
                    <h2 className="font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-5" style={{ color: '#1A1A1A' }}>Confirm Your Order</h2>
                    <div className="space-y-3 text-[0.85rem]">
                      {[
                        { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                        { label: 'Email', value: form.email },
                        { label: 'Phone', value: form.phone },
                        { label: 'Address', value: `${form.address}, ${form.city}, ${form.lga}, ${form.state}` },
                        { label: 'Delivery', value: form.delivery.charAt(0).toUpperCase() + form.delivery.slice(1) },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between py-2 border-b border-black/[0.08]">
                          <span className="text-muted text-[0.72rem] tracking-[0.15em] uppercase">{row.label}</span>
                          <span className="text-right max-w-[250px]" style={{ color: '#1A1A1A' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface2 border border-black/[0.08] p-6">
                    <h3 className="font-semibold text-[0.82rem] tracking-[0.25em] uppercase mb-4" style={{ color: '#1A1A1A' }}>Order Items</h3>
                    {cart.map(item => {
                      const freshProduct = products.find(p => p.id === item.product.id) || item.product
                      return (
                        <div key={item.key} className="flex justify-between items-center py-3 border-b border-black/[0.08] text-[0.85rem]">
                          <span style={{ color: 'rgba(26,26,26,0.8)' }}>{freshProduct.name} × {item.qty} <span className="text-muted">({item.size})</span></span>
                          <span className="font-medium" style={{ color: '#1A1A1A' }}>₦{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      )
                    })}
                    <div className="flex justify-between pt-4">
                      <span className="font-semibold text-[0.9rem]" style={{ color: '#1A1A1A' }}>Total</span>
                      <span className="font-bold text-[1rem]" style={{ color: '#968574' }}>₦{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                    <button onClick={handlePlaceOrder} id="place-order-btn" className="btn-primary flex-1 justify-center">
                      Place Order
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-surface2 border border-black/[0.08] p-6 sticky top-28">
                <h3 className="font-semibold text-[0.8rem] tracking-[0.25em] uppercase mb-5" style={{ color: '#1A1A1A' }}>Your Bag ({cart.length})</h3>
                <div className="space-y-4 mb-6">
                  {cart.map(item => {
                    const freshProduct = products.find(p => p.id === item.product.id) || item.product
                    return (
                      <div key={item.key} className="flex gap-3">
                        <div className="w-14 h-18 aspect-[3/4] overflow-hidden bg-surface shrink-0">
                          <img src={freshProduct.images?.[0] || '/product2.png'} alt={freshProduct.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[0.78rem] font-medium leading-tight mb-1" style={{ color: '#1A1A1A' }}>{freshProduct.name}</p>
                          <p className="text-muted text-[0.65rem]">{item.size} · {item.color}</p>
                          <p className="text-[0.78rem] mt-1" style={{ color: 'rgba(26,26,26,0.8)' }}>₦{item.price} × {item.qty}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-black/[0.08] pt-4 space-y-2">
                  <div className="flex justify-between text-[0.8rem]">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium" style={{ color: '#1A1A1A' }}>₦{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[0.8rem]">
                    <span className="text-muted">Shipping</span>
                    <span className={shipping === 0 ? 'text-lime' : 'font-medium'} style={shipping > 0 ? { color: '#1A1A1A' } : undefined}>{shipping === 0 ? 'FREE' : `₦${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-black/[0.08]">
                    <span className="font-semibold" style={{ color: '#1A1A1A' }}>Total</span>
                    <span className="font-bold" style={{ color: '#968574' }}>₦{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
