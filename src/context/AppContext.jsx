import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as api from '../admin/api/apiClient'

// ─── Context ──────────────────────────────────────────────────────────────────
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Toast ──
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000)
  }, [])

  // ── Cart ──
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_cart') || '[]') } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('mk1974_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product, size, color, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${size}-${color}`
      const existing = prev.find(i => i.key === key)
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { key, product, size, color, qty, price: product.price }]
    })
    showToast(`${product.name} added to bag`)
    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback((key) => {
    setCart(prev => prev.filter(i => i.key !== key))
  }, [])

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  // ── Wishlist ──
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_wishlist') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('mk1974_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }, [])

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist])

  // ── Auth ──
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_user') || 'null') } catch { return null }
  })

  // Restore token if user exists on reload
  useEffect(() => {
    if (user?.token) {
      api.setToken(user.token)
    }
  }, [user])

  const login = useCallback(async (credentials) => {
    try {
      const data = await api.auth.login({
        email: credentials.email,
        password: credentials.password,
      })
      const token = typeof data === 'string' ? data : (data?.token || data?.accessToken || data?.jwt)
      if (token) api.setToken(token)

      const clientData = {
        id: data?.userId || data?.id || '1',
        email: credentials.email,
        firstName: data?.firstName || 'User',
        lastName: data?.lastName || '',
        role: data?.role || 'Customer',
        token,
      }
      setUser(clientData)
      localStorage.setItem('mk1974_user', JSON.stringify(clientData))
      showToast(`Welcome back, ${clientData.firstName}!`)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' }
    }
  }, [showToast])

  const logout = useCallback(() => {
    setUser(null)
    api.setToken(null)
    localStorage.removeItem('mk1974_user')
    showToast('You have been logged out.')
  }, [showToast])

  const register = useCallback(async (userData) => {
    try {
      await api.auth.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: 2, // Role 2 in payload for customer
      })
      
      // Auto login
      const result = await login({ email: userData.email, password: userData.password })
      if (!result.success) {
        return { success: false, error: result.error || 'Registration complete, but login failed.' }
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' }
    }
  }, [login])

  // ── Orders ──
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_orders') || '[]') } catch { return [] }
  })

  const placeOrder = useCallback((orderData) => {
    const newOrder = {
      id: `MK${Date.now().toString().slice(-6)}`,
      ...orderData,
      items: [...cart],
      total: cartTotal,
      status: 'awaiting_payment',
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'awaiting_payment', label: 'Awaiting Payment', date: new Date().toISOString(), done: true },
        { status: 'payment_confirmed', label: 'Payment Confirmed', date: null, done: false },
        { status: 'processing', label: 'Processing', date: null, done: false },
        { status: 'ready_for_delivery', label: 'Ready for Delivery', date: null, done: false },
        { status: 'delivered', label: 'Delivered', date: null, done: false },
      ],
    }
    setOrders(prev => {
      const updated = [newOrder, ...prev]
      localStorage.setItem('mk1974_orders', JSON.stringify(updated))
      return updated
    })
    clearCart()
    return newOrder
  }, [cart, cartTotal, clearCart])


  // ── Search ──
  const [searchOpen, setSearchOpen] = useState(false)

  // ── UI ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const value = {
    // Cart
    cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
    // Wishlist
    wishlist, toggleWishlist, isWishlisted,
    // Auth
    user, login, logout, register,
    // Orders
    orders, placeOrder,
    // Toast
    toast, showToast,
    // Search
    searchOpen, setSearchOpen,
    // UI
    mobileMenuOpen, setMobileMenuOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
