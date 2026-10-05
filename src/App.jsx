import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import SearchOverlay from './components/SearchOverlay'
import BackToTop from './components/BackToTop'

import { categories } from './api/apiClient'

// Dismiss the HTML pre-React brand splash once the app has mounted
function useDismissSplash(delayMs = 800) {
  useEffect(() => {
    // Silently pre-warm backend server on initial app mount
    categories.getAll().catch(() => {})

    const splash = document.getElementById('brand-splash')
    if (!splash) return
    const timer = setTimeout(() => {
      splash.classList.add('fade-out')
      // Remove from DOM after the CSS transition finishes (500ms)
      splash.addEventListener('transitionend', () => splash.remove(), { once: true })
    }, delayMs)
    return () => clearTimeout(timer)
  }, [])
}

// ─── Lazy-loaded pages — each page becomes its own JS chunk ───────────────────
const HomePage            = lazy(() => import('./pages/HomePage'))
const ShopPage            = lazy(() => import('./pages/ShopPage'))
const ProductPage         = lazy(() => import('./pages/ProductPage'))
const CartPage            = lazy(() => import('./pages/CartPage'))
const CheckoutPage        = lazy(() => import('./pages/CheckoutPage'))
const OrderTrackingPage   = lazy(() => import('./pages/OrderTrackingPage'))
const AuthPage            = lazy(() => import('./pages/AuthPage'))
const ProfilePage         = lazy(() => import('./pages/ProfilePage'))
const AboutPage           = lazy(() => import('./pages/AboutPage'))
const NotFoundPage        = lazy(() => import('./pages/NotFoundPage'))
const ContactPage         = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage   = lazy(() => import('./pages/PrivacyPolicyPage'))
// Legacy
const CollectionPage      = lazy(() => import('./pages/CollectionPage'))
const LookbookPage        = lazy(() => import('./pages/LookbookPage'))

// ─── Minimal loading fallback (matches brand background, no flash) ────────────
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, rgba(35, 35, 40, 0.95) 0%, #0a0a0b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/mk2.png"
            alt="MK 1974"
            style={{
              width: 140,
              height: 'auto',
              filter: 'invert(1) brightness(1.1) drop-shadow(0 8px 25px rgba(255, 255, 255, 0.15))',
              animation: 'pageLoaderLogoPulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              userSelect: 'none',
            }}
          />
        </div>
        <div
          style={{
            width: 130,
            height: 2,
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 999,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '45%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1), #ffffff, rgba(255,255,255,0.1))',
              borderRadius: 999,
              animation: 'pageLoaderTrackIndeterminate 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes pageLoaderLogoPulse {
          0% { transform: scale(1) translateY(0); opacity: 0.92; }
          50% { transform: scale(1.04) translateY(-3px); opacity: 1; filter: invert(1) brightness(1.2) drop-shadow(0 12px 30px rgba(255, 255, 255, 0.25)); }
          100% { transform: scale(1) translateY(0); opacity: 0.92; }
        }
        @keyframes pageLoaderTrackIndeterminate {
          0% { left: -45%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Robust scroll to top bypassing smooth scroll issues
    const html = document.documentElement
    const body = document.body

    html.style.scrollBehavior = 'auto'
    html.scrollTop = 0
    body.scrollTop = 0
    window.scrollTo(0, 0)

    // Restore CSS smooth scroll after a brief delay
    setTimeout(() => {
      html.style.scrollBehavior = ''
    }, 10)
  }, [pathname])

  return null
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useDismissSplash(800)
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                         element={<HomePage />} />
            <Route path="/shop"                     element={<ShopPage />} />
            <Route path="/product/:slug"            element={<ProductPage />} />
            <Route path="/cart"                     element={<CartPage />} />
            <Route path="/checkout"                 element={<CheckoutPage />} />
            <Route path="/order-tracking/:orderId"  element={<OrderTrackingPage />} />
            <Route path="/auth"                     element={<AuthPage />} />
            <Route path="/profile"                  element={<ProfilePage />} />
            <Route path="/about"                    element={<AboutPage />} />
            <Route path="/contact"                  element={<ContactPage />} />
            <Route path="/privacy-policy"           element={<PrivacyPolicyPage />} />
            {/* Legacy routes */}
            <Route path="/collection"               element={<CollectionPage />} />
            <Route path="/lookbook"                 element={<LookbookPage />} />
            {/* 404 catch-all */}
            <Route path="*"                         element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        {/* Global overlays — always mounted */}
        <CartDrawer />
        <Toast />
        <SearchOverlay />
        <BackToTop />
      </BrowserRouter>
    </AppProvider>
  )
}
