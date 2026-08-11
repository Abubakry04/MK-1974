import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Oyo', 'Kano', 'Kaduna', 'Enugu', 
  'Delta', 'Anambra', 'Edo', 'Kwara', 'Ondo', 'Imo', 'Abia', 'Akwa Ibom', 
  'Cross River', 'Osun', 'Benue', 'Plateau', 'Borno', 'Bauchi', 'Katsina', 'Sokoto'
]

const STEPS = [
  { id: 0, title: 'Shipping Details', short: 'Details', label: 'Details' },
  { id: 1, title: 'Payment & Receipt', short: 'Payment', label: 'Payment' },
  { id: 2, title: 'Review & Confirm', short: 'Confirm', label: 'Confirm' }
]

export default function CheckoutPage() {
  const { cart, cartTotal, createOrder, submitOrderPayment, user, showToast } = useApp()
  usePageMeta('Secure Checkout — MK 1974', 'Complete your MK 1974 order with secure delivery and bank payment.')
  const navigate = useNavigate()
  
  const [step, setStep] = useState(0)
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || user?.phone || '',
    address: '',
    city: '',
    state: 'Lagos',
    lga: '',
    delivery: 'standard',
  })

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        firstName: f.firstName || user.firstName || '',
        lastName: f.lastName || user.lastName || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phoneNumber || user.phone || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login&redirect=/checkout')
    }
  }, [user, navigate])

  const SHIPPING_FEES = { standard: 3500, express: 5500, 'next-day': 8000 }
  const shippingFee = SHIPPING_FEES[form.delivery] ?? 3500
  const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount)
  const total = subtotalAfterDiscount + shippingFee

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleStep1 = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.state) {
      showToast('Please fill in all required shipping fields', 'error')
      return
    }

    setIsCreatingOrder(true)
    try {
      const orderData = {
        ...form,
        shipping: shippingFee,
        shippingFee: shippingFee,
        discount: discountAmount,
        paymentMethod: 'Direct Bank Transfer',
        totalAmount: total,
        total: total,
      }
      const { orderNumber } = await createOrder(orderData)
      setCreatedOrderNumber(orderNumber)
      showToast(`Order created! Reference Order #${orderNumber}`, 'success')
      setStep(1)
    } catch (err) {
      console.warn('Order creation note:', err.message)
      // Allow proceeding even if server API is offline or returns error
      setStep(1)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleReceiptUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      setReceipt(file.name)
      showToast('Payment receipt attached successfully!')
    }
  }

  const handleApplyPromo = (e) => {
    e.preventDefault()
    const cleanCode = promoCode.trim().toUpperCase()
    if (cleanCode === 'MK10' || cleanCode === 'LAUNCH10') {
      const disc = Math.round(cartTotal * 0.1)
      setDiscountAmount(disc)
      showToast('Promo code applied: 10% Off!')
    } else if (cleanCode === 'VOLT20' || cleanCode === 'MK20') {
      const disc = Math.round(cartTotal * 0.2)
      setDiscountAmount(disc)
      showToast('Promo code applied: 20% Off!')
    } else if (cleanCode) {
      showToast('Invalid promo code. Try MK10 or VOLT20', 'error')
    }
  }

  const handleCopyAccount = () => {
    try {
      navigator.clipboard.writeText('0123456789')
    } catch {}
    setCopiedAccount(true)
    showToast('Account number copied!')
    setTimeout(() => setCopiedAccount(false), 3000)
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    try {
      const orderData = {
        ...form,
        shipping: shippingFee,
        shippingFee: shippingFee,
        discount: discountAmount,
        paymentMethod: 'Direct Bank Transfer',
        receiptName: receipt || null,
        receiptFile: receiptFile || null,
        totalAmount: total,
        total: total,
      }

      let activeOrderNumber = createdOrderNumber
      if (!activeOrderNumber) {
        try {
          const { orderNumber } = await createOrder(orderData)
          activeOrderNumber = orderNumber
          setCreatedOrderNumber(orderNumber)
        } catch {
          activeOrderNumber = `MK-${Date.now().toString().slice(-6)}`
        }
      }

      const order = await submitOrderPayment(activeOrderNumber, receiptFile, orderData)
      showToast('Order and payment submitted successfully!', 'success')
      navigate(`/order-tracking/${order?.id || activeOrderNumber}`)
    } catch (e) {
      showToast('Payment submission failed: ' + (e.message || 'Server error'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-surface flex items-center justify-center px-6 text-dark">
          <div className="text-center max-w-md py-20">
            <div className="w-16 h-16 border border-black/15 flex items-center justify-center mx-auto mb-6 rounded-full bg-white shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark/50">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Your shopping bag is empty</h2>
            <p className="text-dark/60 text-sm mb-8 font-medium">Add items to your bag before proceeding to checkout.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">Explore Collection</button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="bg-surface text-dark min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1180px] mx-auto">
          <div className="mb-8 sm:mb-10 border-b border-black/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block mb-1">MK 1974 Official Checkout</span>
              <h1 className="font-playfair italic font-black text-dark text-3xl sm:text-4xl">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-dark/70 bg-white px-3.5 py-2 rounded-full border border-black/10 shadow-sm w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                  <div
                    className={`flex items-center gap-2 sm:gap-3 cursor-pointer ${i <= step ? 'text-dark font-bold' : 'text-dark/40 font-medium'}`}
                    onClick={() => i < step && setStep(i)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      i < step
                        ? 'bg-dark text-cream font-bold shadow-sm'
                        : i === step
                        ? 'bg-dark text-cream ring-4 ring-black/10 font-bold'
                        : 'border border-black/15 text-dark/40 bg-stone-100'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-[0.72rem] tracking-wider uppercase hidden xs:inline sm:block ${i === step ? 'text-dark font-extrabold' : 'font-semibold'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 sm:mx-4 ${i < step ? 'bg-dark' : 'bg-black/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              {/* Step 0: Shipping Details */}
              {step === 0 && (
                <form onSubmit={handleStep1} className="bg-white border border-black/10 p-5 sm:p-8 rounded-xl space-y-6 shadow-md">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <h2 className="text-dark font-extrabold text-xs tracking-[0.25em] uppercase">
                      1. Contact & Shipping Address
                    </h2>
                    <span className="text-[0.68rem] text-dark/60 font-medium">* Required fields</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">First Name *</label>
                        <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">Last Name *</label>
                        <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">Email Address *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">Phone Number *</label>
                      <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">Street Address *</label>
                      <input type="text" name="address" required value={form.address} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">City *</label>
                        <input type="text" name="city" required value={form.city} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">LGA</label>
                        <input type="text" name="lga" value={form.lga} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-2">State *</label>
                        <select name="state" value={form.state} onChange={handleChange} className="w-full bg-surface border border-black/15 text-dark text-sm px-3 py-3 rounded-lg focus:outline-none focus:border-dark font-medium transition-colors">
                          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-black/10">
                    <h3 className="text-dark font-bold text-xs tracking-[0.2em] uppercase mb-4">Delivery Method</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', label: 'Standard Delivery', desc: 'Delivery in 3-5 business days', price: '₦3,500' },
                        { id: 'express', label: 'Express Dispatch', desc: 'Delivered in 1-2 business days', price: '₦5,500' },
                        { id: 'next-day', label: 'Next-Day Priority', desc: 'Guaranteed next-day dispatch', price: '₦8,000' },
                      ].map(opt => (
                        <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${form.delivery === opt.id ? 'bg-stone-100 border-dark ring-1 ring-dark' : 'bg-surface border-black/15 hover:border-black/30'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="delivery" checked={form.delivery === opt.id} onChange={() => setForm({ ...form, delivery: opt.id })} className="accent-dark w-4 h-4" />
                            <div>
                              <p className="text-dark text-sm font-bold">{opt.label}</p>
                              <p className="text-dark/60 text-xs font-medium">{opt.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-dark shrink-0">{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isCreatingOrder} className="btn-primary py-3.5 px-8 text-xs font-bold rounded-lg shadow-sm disabled:opacity-50">
                      {isCreatingOrder ? 'Creating Order...' : 'Continue to Payment →'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 1: Payment & Receipt */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white border border-black/10 p-5 sm:p-8 rounded-xl space-y-6 shadow-md">
                  <div className="border-b border-black/10 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-dark font-extrabold text-xs tracking-[0.25em] uppercase mb-1">2. Payment Method</h2>
                      <p className="text-xs text-dark/60 font-medium">Direct Bank Transfer to MK 1974 Official Account</p>
                    </div>
                    <button type="button" onClick={() => setStep(0)} className="text-xs text-dark/70 underline font-bold hover:text-dark">Edit Address</button>
                  </div>
                  <div className="bg-surface border border-black/15 p-6 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-black/10 pb-3">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-dark">Official Bank Account</span>
                      <span className="text-[0.65rem] font-bold bg-dark text-cream px-2 py-0.5 rounded uppercase">Verified Merchant</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center"><span className="text-dark/60 text-xs font-medium">Bank Name</span><span className="font-bold text-dark">Guaranty Trust Bank</span></div>
                      <div className="flex justify-between items-center"><span className="text-dark/60 text-xs font-medium">Account Name</span><span className="font-bold text-dark">MK 1974 Apparel Ltd</span></div>
                      <div className="flex justify-between items-center">
                        <span className="text-dark/60 text-xs font-medium">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-base text-dark tracking-wider">0123456789</span>
                          <button type="button" onClick={handleCopyAccount} className="text-xs px-2.5 py-1 bg-dark text-cream hover:bg-black rounded font-bold transition-colors">{copiedAccount ? 'Copied!' : 'Copy'}</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-black/10"><span className="text-dark/60 text-xs font-medium">Exact Amount to Pay</span><span className="font-black text-xl text-dark">₦{total.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold tracking-[0.2em] uppercase text-dark">Upload Transfer Receipt (Optional)</label>
                    <p className="text-xs text-dark/60 font-medium mb-4">Attach your transfer receipt to expedite order processing.</p>
                    <div className="relative border-2 border-dashed border-black/20 hover:border-dark bg-surface p-6 rounded-xl text-center cursor-pointer transition-colors">
                      <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {receiptFile ? (
                        <p className="text-emerald-600 font-bold text-sm">✓ File Selected: {receiptFile.name}</p>
                      ) : (
                        <p className="text-dark text-xs font-bold">Click or drag receipt file here</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <button type="button" onClick={() => setStep(0)} className="px-5 py-3 border border-black/20 hover:bg-stone-100 text-dark text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">← Back</button>
                    <button type="submit" className="btn-primary py-3.5 px-8 text-xs font-bold rounded-lg shadow-sm">Review Order →</button>
                  </div>
                </form>
              )}

              {/* Step 2: Review & Confirm */}
              {step === 2 && (
                <div className="bg-white border border-black/10 p-5 sm:p-8 rounded-xl space-y-8 shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-black/10">
                      <h2 className="text-dark font-extrabold text-xs tracking-[0.25em] uppercase">Order Review</h2>
                      <button onClick={() => setStep(0)} className="text-xs text-dark/70 font-bold underline hover:text-dark">Edit</button>
                    </div>
                    <div className="bg-surface border border-black/10 rounded-xl p-5 space-y-3 text-xs text-dark/80 font-medium">
                      <div className="flex justify-between py-1 border-b border-black/10"><span>Customer</span><span className="font-bold text-dark">{form.firstName} {form.lastName}</span></div>
                      <div className="flex justify-between py-1 border-b border-black/10"><span>Email</span><span className="font-bold text-dark">{form.email}</span></div>
                      <div className="flex justify-between py-1 border-b border-black/10"><span>Phone</span><span className="font-bold text-dark">{form.phone}</span></div>
                      <div className="flex justify-between py-1 border-b border-black/10"><span>Address</span><span className="font-bold text-dark">{form.address}, {form.city}, {form.state}</span></div>
                    </div>
                  </div>
                  <div className="bg-surface border border-black/10 rounded-xl p-5">
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-dark/70 font-bold mb-3">Voucher Code</label>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input type="text" placeholder="Try MK10 or VOLT20" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-white border border-black/15 text-dark text-xs px-4 py-2.5 rounded-lg focus:outline-none font-medium" />
                      <button type="submit" className="px-5 py-2.5 bg-dark text-cream text-xs font-bold uppercase rounded-lg">Apply</button>
                    </form>
                  </div>
                  <div className="flex items-center justify-between pt-4 gap-4">
                    <button type="button" onClick={() => setStep(1)} className="px-5 py-3 border border-black/20 text-dark text-xs font-bold uppercase rounded-lg">← Back</button>
                    <button type="button" disabled={isSubmitting} onClick={handlePlaceOrder} className="px-8 py-4 bg-dark text-cream font-bold text-xs uppercase rounded-lg transition-all shadow-md flex items-center gap-3 disabled:opacity-50">
                      {isSubmitting ? 'Processing...' : 'Complete & Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-black/10 p-6 rounded-xl sticky top-28 space-y-6 shadow-md">
                <h3 className="font-playfair font-bold text-lg text-dark pb-3 border-b border-black/10 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-sans text-dark font-extrabold">{cart.length} Item(s)</span>
                </h3>
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.key} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-12 object-cover rounded border border-black/10" />
                        ) : (
                          <div className="w-10 h-12 bg-surface2 rounded" />
                        )}
                        <div>
                          <p className="font-bold text-dark">{item.product?.name || item.name}</p>
                          <p className="text-dark/60 font-medium">Qty: {item.qty} {item.size ? `· ${item.size}` : ''}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-dark">₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/10 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-dark/70 font-medium"><span>Subtotal</span><span className="text-dark font-bold">₦{cartTotal.toLocaleString()}</span></div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold"><span>Promo Discount</span><span>-₦{discountAmount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between text-dark/70 font-medium"><span>Shipping</span><span className="text-dark font-bold">₦{shippingFee.toLocaleString()}</span></div>
                  <div className="border-t border-black/10 pt-4 flex justify-between items-baseline">
                    <span className="font-extrabold text-base text-dark uppercase">Grand Total</span>
                    <span className="font-black text-2xl text-dark">₦{total.toLocaleString()}</span>
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
