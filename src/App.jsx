import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
