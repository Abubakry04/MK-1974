import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import SearchOverlay from './components/SearchOverlay'

// Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Legacy pages
import CollectionPage from './pages/CollectionPage'
import LookbookPage from './pages/LookbookPage'

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
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Legacy routes */}
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/lookbook" element={<LookbookPage />} />
        </Routes>

        {/* Global overlays — always mounted */}
        <CartDrawer />
        <Toast />
        <SearchOverlay />
      </BrowserRouter>
    </AppProvider>
  )
}
