import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import SearchOverlay from './components/SearchOverlay'
import BackToTop from './components/BackToTop'

// Dismiss the HTML pre-React brand splash once the app has mounted
function useDismissSplash(delayMs = 800) {
  useEffect(() => {
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
        background: '#f5f4f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '2px solid rgba(0,0,0,0.1)',
          borderTopColor: '#1a1a1a',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
