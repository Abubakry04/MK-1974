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
  { id: 0, title: 'Shipping Details', short: 'Details' },
  { id: 1, title: 'Payment & Receipt', short: 'Payment' },
  { id: 2, title: 'Review & Confirm', short: 'Confirm' }
]

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder, createOrder, submitOrderPayment, user, products, showToast } = useApp()
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
    phone: user?.phoneNumber || '',
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
        phone: f.phone || user.phoneNumber || '',
      }))
    }
  }, [user])

  const SHIPPING_FEES = { standard: 3000, express: 5000, 'next-day': 8000 }
  const shippingFee = SHIPPING_FEES[form.delivery] ?? 3000
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
      // Call POST /api/Order right here on Step 1!
      const { orderNumber } = await createOrder(orderData)
      setCreatedOrderNumber(orderNumber)
      showToast(`Order created! Reference Order #${orderNumber}`, 'success')
      setStep(1)
    } catch (err) {
      showToast('Order creation failed: ' + (err.message || 'Server error'), 'error')
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
    navigator.clipboard.writeText('0123456789')
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
        const { orderNumber } = await createOrder(orderData)
        activeOrderNumber = orderNumber
        setCreatedOrderNumber(orderNumber)
      }

      // Submit payment receipt to POST /api/Payment/submit with valid OrderNumber
      const order = await submitOrderPayment(activeOrderNumber, receiptFile, orderData)
      showToast('Order and payment submitted successfully!', 'success')
      navigate(`/order-tracking/${order?.id || activeOrderNumber}`)
    } catch (e) {
      showToast('Payment submission failed: ' + (e.message || 'Server error'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login&redirect=/checkout')
    }
  }, [user, navigate])

  if (cart.length === 0) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center px-6">
          <div className="text-center max-w-md py-20">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center mx-auto mb-6 rounded-full bg-white/5 shadow-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/50">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-cream mb-2">Your shopping bag is empty</h2>
            <p className="text-cream/40 text-sm mb-8">Add items to your bag before proceeding to checkout.</p>
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
      <main className="bg-dark text-cream min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1180px] mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10 border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow block mb-1">MK 1974 Official Checkout</span>
              <h1 className="font-playfair italic font-black text-cream text-3xl sm:text-4xl">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-cream/50 bg-white/5 px-3.5 py-2 rounded-full border border-white/10 w-fit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          {/* Responsive Stepper */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                  <div
                    className={`flex items-center gap-2 sm:gap-3 cursor-pointer ${i <= step ? 'text-cream' : 'text-cream/30'}`}
                    onClick={() => i < step && setStep(i)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      i < step
                        ? 'bg-lime text-dark font-bold'
                        : i === step
                        ? 'border-2 border-lime text-lime bg-lime/10'
                        : 'border border-white/20 text-cream/40 bg-white/5'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-[0.72rem] tracking-wider uppercase hidden xs:inline sm:block ${i === step ? 'text-cream font-bold' : 'font-medium'}`}>
                      {s.short}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-[1px] mx-2 sm:mx-4 transition-colors ${i < step ? 'bg-lime' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Content Area (Steps 0, 1, 2) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* STEP 0: Shipping Information */}
              {step === 0 && (
                <form onSubmit={handleStep1} className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-lg space-y-8 shadow-2xl backdrop-blur-sm">
                  <div>
                    <h2 className="text-lime font-bold text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
                      <span>01</span>
                      <span className="w-4 h-[1px] bg-lime/40" />
                      <span>Contact Information</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+234 800 000 0000"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lime font-bold text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
                      <span>02</span>
                      <span className="w-4 h-[1px] bg-lime/40" />
                      <span>Shipping Address</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">Street Address *</label>
                        <input
                          name="address"
                          placeholder="e.g. 12 Victoria Island Avenue"
                          value={form.address}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">City *</label>
                          <input
                            name="city"
                            placeholder="e.g. Ikeja"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">LGA</label>
                          <input
                            name="lga"
                            placeholder="e.g. Eti-Osa"
                            value={form.lga}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-2">State *</label>
                          <select
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            required
                            className="w-full bg-surface border border-white/15 text-onlight text-sm px-4 py-3 rounded focus:outline-none focus:border-lime transition-colors"
                          >
                            {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lime font-bold text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
                      <span>03</span>
                      <span className="w-4 h-[1px] bg-lime/40" />
                      <span>Delivery Method</span>
                    </h2>
                    <div className="space-y-3">
                      {[
                        { value: 'standard', label: 'Standard Delivery', desc: '3–5 business days across Nigeria', price: '₦3,000' },
                        { value: 'express', label: 'Express Delivery', desc: '1–2 business days (Major cities)', price: '₦5,000' },
                        { value: 'next-day', label: 'Same-Day / Next Day Lagos Dispatch', desc: 'Orders confirmed before 1pm in Lagos', price: '₦8,000' },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${form.delivery === opt.value ? 'border-lime bg-lime/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                          <div className="flex items-center gap-3.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${form.delivery === opt.value ? 'border-lime' : 'border-white/30'}`}>
                              {form.delivery === opt.value && <div className="w-2 h-2 rounded-full bg-lime" />}
                            </div>
                            <div>
                              <p className="text-cream text-sm font-medium">{opt.label}</p>
                              <p className="text-cream/40 text-xs">{opt.desc}</p>
                            </div>
                          </div>
                          <input type="radio" name="delivery" value={opt.value} checked={form.delivery === opt.value} onChange={handleChange} className="hidden" />
                          <span className="text-sm font-bold text-cream shrink-0">{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isCreatingOrder} className="w-full sm:w-auto px-8 py-3.5 bg-lime text-dark font-semibold text-xs tracking-[0.15em] uppercase rounded hover:bg-lime-dim hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      {isCreatingOrder ? (
                        <span>Creating Order...</span>
                      ) : (
                        <>
                          <span>Proceed to Payment</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 1: Bank Payment & Receipt Upload */}
              {step === 1 && (
                <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-lg space-y-8 shadow-2xl backdrop-blur-sm">
                  <div>
                    <h2 className="text-lime font-bold text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
                      <span>Payment Method</span>
                    </h2>

                    {/* Direct Bank Transfer Card */}
                    <div className="space-y-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/60">Official Bank Account</span>
                          <span className="text-[0.7rem] bg-lime/20 text-lime px-2.5 py-1 rounded font-semibold">Direct Transfer</span>
                        </div>

                        <div className="space-y-3 text.sm">
                          {createdOrderNumber && (
                            <div className="flex justify-between items-center py-2 border-b border-white/10 bg-lime/10 px-3 rounded">
                              <span className="text-lime text-xs font-bold uppercase tracking-wider">Order Reference #</span>
                              <span className="font-mono text-sm text-lime font-bold">{createdOrderNumber}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-cream/50 text-xs">Bank Name</span>
                            <span className="font-medium text-cream">Guaranty Trust Bank (GTBank)</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-cream/50 text-xs">Account Name</span>
                            <span className="font-medium text-cream">MK 1974 Apparel Ltd</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-cream/50 text-xs">Account Number</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-base text-lime font-bold">0123456789</span>
                              <button
                                type="button"
                                onClick={handleCopyAccount}
                                className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 text-cream rounded transition-colors"
                              >
                                {copiedAccount ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-cream/50 text-xs">Exact Amount to Pay</span>
                            <span className="font-bold text-xl text-cream">₦{total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Upload Receipt */}
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-cream/80 mb-1">
                          Upload Payment Proof (Optional)
                        </label>
                        <p className="text-xs text-cream/40 mb-4">Attach your transfer receipt screenshot/PDF to expedite order processing.</p>

                        <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${receipt ? 'border-lime bg-lime/10' : 'border-white/20 bg-white/5 hover:border-white/40'}`}>
                          <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
                          {receipt ? (
                            <div className="text-center px-4">
                              <svg className="text-lime mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                              <p className="text-lime text-xs font-semibold truncate max-w-xs">{receipt}</p>
                              <p className="text-cream/40 text-[0.68rem] mt-1">Click to replace file</p>
                            </div>
                          ) : (
                            <div className="text-center px-4">
                              <svg className="text-cream/40 mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <p className="text-cream/80 text-xs font-medium">Click or drag receipt file here</p>
                              <p className="text-cream/40 text-[0.65rem] mt-1">Supports JPG, PNG, PDF up to 10MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="px-5 py-3 border border-white/20 hover:bg-white/10 text-cream text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 bg-lime text-dark font-semibold text-xs tracking-[0.15em] uppercase rounded hover:bg-lime-dim hover:text-white transition-all"
                    >
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Review & Complete Order */}
              {step === 2 && (
                <div className="bg-white/5 border border-white/10 p-5 sm:p-8 rounded-lg space-y-8 shadow-2xl backdrop-blur-sm">
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                      <h2 className="text-lime font-bold text-xs tracking-[0.25em] uppercase">
                        Order & Delivery Review
                      </h2>
                      <button onClick={() => setStep(0)} className="text-xs text-lime underline hover:text-cream">
                        Edit Info
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-5 space-y-3 text-xs text-cream/80">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-cream/40">Customer</span>
                        <span className="font-medium text-cream">{form.firstName} {form.lastName} ({form.phone})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-cream/40">Email</span>
                        <span className="font-medium text-cream">{form.email}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-cream/40">Delivery Address</span>
                        <span className="font-medium text-cream text-right max-w-xs">{form.address}, {form.city}, {form.state}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-cream/40">Delivery Option</span>
                        <span className="font-medium text-cream capitalize">{form.delivery} Delivery (₦{shippingFee.toLocaleString()})</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-cream/40">Payment Option</span>
                        <span className="font-medium text-cream">
                          Direct Bank Transfer{receipt ? ' (Receipt Attached)' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                    <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-cream/60 mb-3">Voucher / Discount Code</label>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try MK10 or VOLT20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/15 text-cream text-xs px-4 py-2.5 rounded focus:outline-none focus:border-lime"
                      />
                      <button type="submit" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold uppercase tracking-wider rounded transition-colors">
                        Apply
                      </button>
                    </form>
                    {discountAmount > 0 && (
                      <p className="text-xs text-lime mt-2 font-medium">Discount applied: -₦{discountAmount.toLocaleString()}</p>
                    )}
                  </div>

                  {/* Line items list */}
                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/70 mb-4">Selected Items ({cart.length})</h3>
                    <div className="divide-y divide-white/5 border-t border-b border-white/10">
                      {cart.map(item => {
                        const freshProduct = products.find(p => p.id === item.product.id) || item.product
                        return (
                          <div key={item.key} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <img src={freshProduct.images?.[0] || '/product2.png'} alt={freshProduct.name} className="w-12 h-16 object-cover bg-surface2 rounded" />
                              <div>
                                <p className="text-xs font-medium text-cream">{freshProduct.name}</p>
                                <p className="text-[0.68rem] text-cream/40">Size: {item.size} · Color: {item.color} · Qty: {item.qty}</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-cream">₦{(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Submit CTAs */}
                  <div className="flex items-center justify-between pt-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 border border-white/20 hover:bg-white/10 text-cream text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      id="place-order-btn"
                      disabled={isSubmitting}
                      onClick={handlePlaceOrder}
                      className="px-8 sm:px-10 py-4 bg-lime hover:bg-lime-dim text-dark hover:text-white font-bold text-xs tracking-[0.2em] uppercase rounded transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Complete & Place Order</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Sidebar (Sticky) */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg sticky top-28 space-y-6 shadow-2xl backdrop-blur-sm">
                <h3 className="font-playfair font-bold text-lg text-cream pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-sans text-lime font-bold">{cart.length} Item{cart.length > 1 ? 's' : ''}</span>
                </h3>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map(item => {
                    const freshProduct = products.find(p => p.id === item.product.id) || item.product
                    return (
                      <div key={item.key} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-3">
                          <img src={freshProduct.images?.[0] || '/product2.png'} alt={freshProduct.name} className="w-10 h-12 object-cover bg-surface2 rounded" />
                          <div>
                            <p className="font-medium text-cream line-clamp-1">{freshProduct.name}</p>
                            <p className="text-cream/40 text-[0.65rem]">{item.size} / {item.color} (×{item.qty})</p>
                          </div>
                        </div>
                        <span className="font-semibold text-cream">₦{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-cream/60">
                    <span>Subtotal</span>
                    <span className="text-cream font-medium">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-lime">
                      <span>Discount</span>
                      <span className="font-medium">-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-cream/60">
                    <span>Shipping ({form.delivery})</span>
                    <span className="text-cream font-medium">₦{shippingFee.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                    <span className="font-bold text-base text-cream uppercase">Grand Total</span>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-cream">₦{total.toLocaleString()}</span>
                      <p className="text-[0.65rem] text-cream/40 uppercase tracking-wider mt-0.5">Includes taxes & duties</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg text-xs space-y-2 text-cream/50 border border-white/5">
                  <div className="flex items-center gap-2 text-cream">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lime"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span className="font-semibold text-[0.72rem]">Buyer Protection Guaranteed</span>
                  </div>
                  <p className="text-[0.68rem] leading-relaxed">Free exchange within 7 days. Need assistance? Contact customercare@mk1974.com</p>
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
