import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import * as api from '../api/apiClient'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const STATUS_STEPS = [
  { key: 'awaiting_payment', label: 'Awaiting Payment / Review', icon: '💳', desc: 'Order received. We are waiting for payment verification.' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: '✅', desc: 'Your bank transfer payment has been approved by admin.' },
  { key: 'processing', label: 'Processing & Packing', icon: '📦', desc: 'Your items are being prepared for dispatch.' },
  { key: 'ready_for_delivery', label: 'Dispatched / In Transit', icon: '🚚', desc: 'Your package is out with courier for delivery.' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Order delivered successfully.' },
]

function normalizeStatusStep(rawStatus) {
  if (!rawStatus) return 0
  const s = String(rawStatus).toLowerCase().replace(/[^a-z0-9]/g, '')
  if (s === 'pendingpayment' || s === 'pending' || s === 'awaitingpayment') return 0
  if (s === 'paymentsubmitted' || s === 'submitted') return 0
  if (s === 'paid' || s === 'paymentconfirmed' || s === 'paymentapproved' || s === 'approved') return 1
  if (s === 'processing') return 2
  if (s === 'shipped' || s === 'readyfordelivery' || s === 'intransit' || s === 'dispatched') return 3
  if (s === 'delivered') return 4
  if (s === 'cancelled' || s === 'paymentrejected' || s === 'rejected') return -1 // Rejected / Cancelled state
  return 0
}

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders } = useApp()

  const localOrder = orders.find(o => String(o.id).toLowerCase() === String(orderId).toLowerCase())
  const [liveOrderData, setLiveOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  // Fetch live order status from backend API (/api/Order/{orderNumber})
  useEffect(() => {
    let isMounted = true

    async function fetchLiveStatus() {
      if (!orderId) return
      try {
        const res = await api.orders.getOne(orderId)
        if (!isMounted) return
        const data = res?.data ?? res
        if (data) {
          setLiveOrderData(data)
          setFetchError(null)
        }
      } catch (err) {
        if (!isMounted) return
        console.warn('[OrderTrackingPage] Live fetch notice:', err.message)
        setFetchError(err.message)
      }
    }

    setIsLoading(true)
    fetchLiveStatus().finally(() => { if (isMounted) setIsLoading(false) })

    // Poll live status every 10 seconds for real-time admin status updates
    const interval = setInterval(fetchLiveStatus, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [orderId])

  const effectiveOrder = liveOrderData ? {
    id: liveOrderData.orderNumber || liveOrderData.orderId || liveOrderData.id || localOrder?.id || orderId,
    customer: liveOrderData.customerName || (localOrder ? `${localOrder.firstName} ${localOrder.lastName}` : 'Customer'),
    firstName: localOrder?.firstName || liveOrderData.customerName?.split(' ')[0] || 'Customer',
    lastName: localOrder?.lastName || liveOrderData.customerName?.split(' ')[1] || '',
    email: liveOrderData.user?.email || localOrder?.email || 'N/A',
    phone: localOrder?.phone || 'N/A',
    address: localOrder?.address || liveOrderData.shippingAddress?.street || 'Provided at checkout',
    city: localOrder?.city || liveOrderData.shippingAddress?.city || '',
    lga: localOrder?.lga || '',
    state: localOrder?.state || liveOrderData.shippingAddress?.state || '',
    status: liveOrderData.status || localOrder?.status || 'pending',
    items: localOrder?.items || [],
    total: liveOrderData.totalAmount || liveOrderData.total || localOrder?.total || 0,
    timeline: localOrder?.timeline || [],
    rawDate: liveOrderData.createdAt || liveOrderData.orderDate || localOrder?.createdAt
  } : localOrder

  if (!effectiveOrder && !isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center px-8">
          <div className="text-center max-w-md py-20">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center mx-auto mb-6 rounded-full bg-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/50">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="eyebrow mb-2">Order Not Found</p>
            <h2 className="text-xl font-bold text-cream mb-4">No order record matching #{orderId}</h2>
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
      <main className="bg-dark min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-8 md:px-12 text-cream">
        <div className="max-w-[900px] mx-auto py-8">
          {/* Top navigation */}
          <div className="mb-8">
            <Link to="/shop" className="text-cream/50 text-[0.7rem] tracking-[0.2em] uppercase hover:text-cream transition-colors flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Back to Store
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="eyebrow block mb-1">Live Order Status Tracking</span>
                <h1 className="font-playfair font-black italic text-cream text-3xl sm:text-4xl">Order #{displayOrderNumber}</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-cream/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span>Live Admin Sync Active</span>
              </div>
            </div>
          </div>

          {/* Alert banner if Rejected/Cancelled */}
          {isRejectedOrCancelled && (
            <div className="mb-8 bg-red-500/10 border border-red-500/30 p-6 rounded-lg text-red-400 text-sm">
              <div className="flex items-center gap-3 mb-2 font-bold text-base">
                <span>⚠️ Order Status: Payment Rejected / Cancelled</span>
              </div>
              <p className="text-cream/80 text-xs leading-relaxed">
                Your bank transfer receipt could not be verified by our administrative team. If you believe this is an error, please contact customer support or re-submit your transfer receipt.
              </p>
            </div>
          )}

          {/* Status timeline */}
          <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-lg mb-8 backdrop-blur-sm shadow-2xl">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-5 bottom-5 w-[1px] bg-white/10 hidden md:block" />
              {!isRejectedOrCancelled && (
                <div
                  className="absolute left-5 top-5 w-[1px] bg-lime hidden md:block transition-all duration-1000"
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
                          ? 'border-lime bg-lime text-dark font-bold shadow-[0_0_15px_rgba(196,98,45,0.4)]'
                          : 'border-white/20 bg-dark text-cream/40'
                      }`}>
                        {isDone && i < currentStepIndex ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span className="text-sm">{step.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-semibold tracking-wide ${isDone ? 'text-cream' : 'text-cream/40'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="bg-lime/20 text-lime text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className="text-cream/50 text-xs leading-relaxed">{step.desc}</p>
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
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h2 className="font-bold text-xs tracking-[0.2em] uppercase mb-4 text-lime">Delivery Information</h2>
                <p className="text-sm leading-relaxed text-cream/80">
                  <strong className="text-cream">{effectiveOrder.customer || `${effectiveOrder.firstName} ${effectiveOrder.lastName}`}</strong><br />
                  {effectiveOrder.address}<br />
                  {effectiveOrder.city}{effectiveOrder.state ? `, ${effectiveOrder.state}` : ''}<br />
                  <span className="text-xs text-cream/50 mt-2 block">Phone: {effectiveOrder.phone} · Email: {effectiveOrder.email}</span>
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h2 className="font-bold text-xs tracking-[0.2em] uppercase mb-4 text-lime">Order Summary</h2>
                <div className="space-y-2">
                  {effectiveOrder.items && effectiveOrder.items.length > 0 ? (
                    effectiveOrder.items.map(item => (
                      <div key={item.key || item.product?.id || Math.random()} className="flex justify-between text-xs text-cream/80">
                        <span>{item.product?.name || 'Store Item'} × {item.qty || 1}</span>
                        <span className="font-semibold text-cream">₦{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-xs text-cream/80">
                      <span>Order Items</span>
                      <span className="font-semibold text-cream">Verified at Checkout</span>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-3 flex justify-between items-baseline mt-2">
                    <span className="font-bold text-sm text-cream uppercase">Total Amount</span>
                    <span className="font-bold text-lg text-cream">₦{Number(effectiveOrder.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <p className="text-cream/50 text-xs mb-3">Questions regarding your delivery status?</p>
            <Link to="/contact" className="text-xs text-lime underline hover:text-cream">Contact MK 1974 Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
