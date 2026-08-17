import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const STATUS_STEPS = [
  { key: 'Pending Approval', label: 'Order Placed & Awaiting Verification', desc: 'Your order was received and payment receipt is under review.', icon: '📝' },
  { key: 'Payment Verified', label: 'Payment Verified', desc: 'Bank transfer payment successfully verified and approved.', icon: '✓' },
  { key: 'Processing', label: 'Processing', desc: 'Your apparel is being inspected, prepared, and packed for dispatch.', icon: '⚡' },
  { key: 'Shipped', label: 'Shipped & En Route', desc: 'Handed to courier for delivery to your shipping address.', icon: '📦' },
  { key: 'Delivered', label: 'Delivered', desc: 'Package delivered successfully. Enjoy your MK 1974 Sports Fashion Wear!', icon: '✨' },
]

function normalizeStatusStep(statusStr) {
  if (!statusStr) return 0
  const lower = statusStr.toLowerCase().trim()
  if (lower === 'paymentrejected' || lower === 'cancelled' || lower === 'refunded' || lower.includes('reject') || lower.includes('cancel')) return -1
  if (lower === 'delivered' || lower.includes('deliver')) return 4
  if (lower === 'shipped' || lower.includes('ship') || lower.includes('transit')) return 3
  if (lower === 'processing' || lower.includes('process') || lower.includes('pack') || lower.includes('inspect')) return 2
  if (lower === 'paid' || lower === 'paymentapproved' || lower.includes('paid') || lower.includes('approve') || lower.includes('verifi')) return 1
  return 0 // PendingPayment, PaymentSubmitted
}

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders, fetchOrderTracking } = useApp()

  usePageMeta(`Order #${orderId} Status — MK 1974`, 'Live real-time tracking for your MK 1974 streetwear order.')

  const [liveOrder, setLiveOrder] = useState(null)

  useEffect(() => {
    let isMounted = true
    const checkTracking = async () => {
      if (orderId && fetchOrderTracking) {
        const res = await fetchOrderTracking(orderId)
        if (isMounted && res) {
          setLiveOrder(res)
        }
      }
    }
    checkTracking()
    const interval = setInterval(checkTracking, 5000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [orderId, fetchOrderTracking])

  // Check if we have order details from live API, local AppContext state or localStorage
  const foundOrder = (orders || []).find(o => String(o.id) === String(orderId))
  const storedOrder = (() => {
    try {
      const stored = localStorage.getItem(`mk1974_order_${orderId}`)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  const effectiveOrder = liveOrder || foundOrder || storedOrder

  if (!effectiveOrder && !orderId) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-surface flex items-center justify-center px-8 text-dark">
          <div className="text-center max-w-md py-20">
            <div className="w-16 h-16 border border-black/15 flex items-center justify-center mx-auto mb-6 rounded-full bg-white shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark/50">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="eyebrow mb-2">Order Not Found</p>
            <h2 className="text-xl font-bold text-dark mb-4">No order record matching #{orderId}</h2>
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const currentStepIndex = normalizeStatusStep(effectiveOrder?.status)
  const isRejectedOrCancelled = currentStepIndex === -1
  const displayOrderNumber = effectiveOrder?.id || orderId

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-8 md:px-12 text-dark">
        <div className="max-w-[900px] mx-auto py-8">
          {/* Top navigation */}
          <div className="mb-8">
            <Link to="/shop" className="text-dark/60 text-[0.7rem] tracking-[0.2em] uppercase font-bold hover:text-dark transition-colors flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Back to Store
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="eyebrow block mb-1">Live Order Status Tracking</span>
                <h1 className="font-playfair font-black italic text-dark text-3xl sm:text-4xl">Order #{displayOrderNumber}</h1>
              </div>
              {/* <div className="flex items-center gap-2 text-xs font-semibold text-dark/70 bg-white px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Admin Sync Active</span>
              </div> */}
            </div>
          </div>

          {/* Alert banner if Rejected/Cancelled */}
          {isRejectedOrCancelled && (
            <div className="mb-8 bg-red-50 border border-red-200 p-6 rounded-xl text-red-700 text-sm">
              <div className="flex items-center gap-3 mb-2 font-bold text-base">
                <span>⚠️ Order Status: Payment Rejected / Cancelled</span>
              </div>
              <p className="text-red-600 text-xs leading-relaxed font-medium">
                Your bank transfer receipt could not be verified by our administrative team. If you believe this is an error, please contact customer support or re-submit your transfer receipt.
              </p>
            </div>
          )}

          {/* Status timeline */}
          <div className="bg-white border border-black/10 p-6 sm:p-8 rounded-xl mb-8 shadow-md">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-5 bottom-5 w-[2px] bg-stone-200 hidden md:block" />
              {!isRejectedOrCancelled && (
                <div
                  className="absolute left-5 top-5 w-[2px] bg-dark hidden md:block transition-all duration-1000"
                  style={{ height: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1))) * 100}%` }}
                />
              )}

              <div className="space-y-8">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = !isRejectedOrCancelled && i <= currentStepIndex
                  const isCurrent = !isRejectedOrCancelled && i === currentStepIndex

                  return (
                    <div key={step.key} className="flex items-start gap-5 sm:gap-8">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        isDone
                          ? 'border-dark bg-dark text-cream font-bold shadow-md'
                          : 'border-black/15 bg-stone-100 text-dark/40'
                      }`}>
                        {isDone && i < currentStepIndex ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span className="text-sm">{step.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-bold tracking-wide ${isDone ? 'text-dark' : 'text-dark/40'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="bg-dark text-cream text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-dark/60 text-xs leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order details summary */}
          {effectiveOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm">
                <h2 className="font-bold text-xs tracking-[0.2em] uppercase mb-4 text-dark">Delivery Information</h2>
                <p className="text-sm leading-relaxed text-dark/80 font-medium">
                  <strong className="text-dark font-bold">{effectiveOrder.customer || `${effectiveOrder.firstName} ${effectiveOrder.lastName}`}</strong><br />
                  {effectiveOrder.address}<br />
                  {effectiveOrder.city}{effectiveOrder.state ? `, ${effectiveOrder.state}` : ''}<br />
                  <span className="text-xs text-dark/60 mt-2 block">Phone: {effectiveOrder.phone} · Email: {effectiveOrder.email}</span>
                </p>
              </div> */}

              <div className="bg-white border border-black/10 p-6 rounded-xl shadow-sm">
                <h2 className="font-bold text-xs tracking-[0.2em] uppercase mb-4 text-dark">Order Summary</h2>
                <div className="space-y-2">
                  {effectiveOrder.items && effectiveOrder.items.length > 0 ? (
                    effectiveOrder.items.map(item => (
                      <div key={item.key || item.product?.id || Math.random()} className="flex justify-between text-xs text-dark/80 font-medium">
                        <span>{item.product?.name || 'Store Item'} × {item.qty || 1}</span>
                        <span className="font-bold text-dark">₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-xs text-dark/80 font-medium">
                      <span>Order Items</span>
                      <span className="font-bold text-dark">Verified at Checkout</span>
                    </div>
                  )}

                  <div className="border-t border-black/10 pt-3 flex justify-between items-baseline mt-2">
                    <span className="font-bold text-sm text-dark uppercase">Total Amount</span>
                    <span className="font-extrabold text-lg text-dark">₦{Number(effectiveOrder.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-dark/60 text-xs mb-3 font-medium">Questions regarding your delivery status?</p>
            <Link to="/contact" className="text-xs text-dark font-bold underline hover:text-accent">Contact MK 1974 Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
