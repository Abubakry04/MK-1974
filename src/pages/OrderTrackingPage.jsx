import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const STATUS_STEPS = [
  { key: 'awaiting_payment', label: 'Awaiting Payment', icon: '💳', desc: 'We are waiting for your payment confirmation.' },
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: '✅', desc: 'Your payment has been verified.' },
  { key: 'processing', label: 'Processing', icon: '📦', desc: 'Your order is being packed.' },
  { key: 'ready_for_delivery', label: 'Ready for Delivery', icon: '🚚', desc: 'Your order is with our courier.' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Your order has been delivered.' },
]

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders } = useApp()

  const order = orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-dark flex items-center justify-center px-8">
          <div className="text-center">
            <p className="text-cream/40 text-[0.85rem] tracking-[0.2em] uppercase mb-6">Order not found</p>
            <Link to="/profile" className="btn-primary">View Your Orders</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status)

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen pt-24 px-8 md:px-12">
        <div className="max-w-[900px] mx-auto py-12">
          <div className="mb-10">
            <Link to="/profile" className="text-muted text-[0.7rem] tracking-[0.2em] uppercase hover:text-cream transition-colors flex items-center gap-2 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Back to Orders
            </Link>
            <p className="eyebrow mb-2">Order #{order.id}</p>
            <h1 className="font-playfair font-black italic text-cream text-4xl">Track Your Order</h1>
          </div>

          {/* Status timeline */}
          <div className="bg-surface2 border border-black/[0.08] p-8 mb-8">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-5 bottom-5 w-[1px] bg-black/10 hidden md:block" />
              <div
                className="absolute left-5 top-5 w-[1px] bg-lime hidden md:block transition-all duration-1000"
                style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              <div className="space-y-8">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i <= currentStepIndex
                  const isCurrent = i === currentStepIndex
                  return (
                    <div key={step.key} className="flex items-start gap-6 md:gap-8">
                      <div className={`relative z-10 w-10 h-10 flex items-center justify-center shrink-0 border-2 transition-all ${
                        isDone ? 'border-lime bg-lime text-dark' : 'border-black/20 bg-surface text-muted'
                      } ${isCurrent ? 'shadow-[0_0_20px_rgba(176,141,87,0.4)]' : ''}`}>
                        {isDone && i < currentStepIndex ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span className="text-[0.8rem]">{step.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[0.85rem] font-semibold tracking-[0.05em]" style={isDone ? { color: '#1A1A1A' } : { color: 'rgba(26,26,26,0.45)' }}>{step.label}</p>
                          {isCurrent && <span className="text-lime text-[0.6rem] font-black tracking-[0.2em] uppercase animate-pulse">Current</span>}
                        </div>
                        <p className="text-muted text-[0.75rem] leading-[1.6]">{step.desc}</p>
                        {order.timeline[i]?.date && (
                          <p className="text-muted/50 text-[0.65rem] mt-1">{new Date(order.timeline[i].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface2 border border-black/[0.08] p-6">
              <h2 className="font-semibold text-[0.8rem] tracking-[0.25em] uppercase mb-4" style={{ color: '#1A1A1A' }}>Delivery Address</h2>
              <p className="text-[0.88rem] leading-[1.8]" style={{ color: 'rgba(26,26,26,0.8)' }}>
                {order.firstName} {order.lastName}<br />
                {order.address}<br />
                {order.city}, {order.lga}<br />
                {order.state}
              </p>
            </div>

            <div className="bg-surface2 border border-black/[0.08] p-6">
              <h2 className="font-semibold text-[0.8rem] tracking-[0.25em] uppercase mb-4" style={{ color: '#1A1A1A' }}>Order Summary</h2>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.key} className="flex justify-between text-[0.82rem]">
                    <span style={{ color: 'rgba(26,26,26,0.7)' }}>{item.product.name} × {item.qty}</span>
                    <span className="font-medium" style={{ color: '#1A1A1A' }}>₦{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-black/[0.08] pt-3 flex justify-between">
                  <span className="font-semibold text-[0.85rem]" style={{ color: '#1A1A1A' }}>Total</span>
                  <span className="font-bold" style={{ color: '#968574' }}>₦{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted text-[0.75rem] mb-4">Need help with your order?</p>
            <Link to="/contact" className="btn-ghost">Contact Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
