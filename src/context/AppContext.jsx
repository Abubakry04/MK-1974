import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import * as api from '../api/apiClient'
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES as STATIC_CATEGORIES } from '../data/products'


// ─── Context ──────────────────────────────────────────────────────────────────
//
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── API data ──
  const [apiProducts, setApiProducts] = useState([])
  const [apiCategories, setApiCategories] = useState([])
  const [apiColors, setApiColors] = useState([])
  const [apiSizes, setApiSizes] = useState([])
  const [apiLoading, setApiLoading] = useState(false)

  const fetchStoreData = useCallback(async () => {
    setApiLoading(true)
    try {
      let prods = []
      let cats = []
      let cols = []
      let szs = []
      
      try {
        prods = await api.products.getAll()
      } catch (e) {
        console.error('[Storefront API] Failed to load products:', e)
      }
      
      try {
        cats = await api.categories.getAll()
      } catch (e) {
        console.error('[Storefront API] Failed to load categories:', e)
      }

      try {
        cols = await api.colors.getAll()
      } catch (e) {
        console.error('[Storefront API] Failed to load colors:', e)
      }

      try {
        szs = await api.sizes.getAll()
      } catch (e) {
        console.error('[Storefront API] Failed to load sizes:', e)
      }

      setApiProducts(Array.isArray(prods) ? prods : [])
      setApiCategories(Array.isArray(cats) ? cats.map(c => ({
        ...c,
        id: c.categoryId ?? c.id
      })) : [])
      setApiColors(Array.isArray(cols) ? cols : [])
      setApiSizes(Array.isArray(szs) ? szs : [])
    } catch (err) {
      console.error('[Storefront API] Failed to load data:', err)
    } finally {
      setApiLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStoreData()
  }, [fetchStoreData])

  const mappedProducts = useMemo(() => {
    const mappedApi = apiProducts.map(p => {
      // Map API categories
      const categoriesArray = (p.categories || []).map(c => ({
        ...c,
        id: c.categoryId ?? c.id
      }))
      const mainCat = categoriesArray.length > 0 ? categoriesArray[0].name : ''

      // Fetch images from localStorage if present
      let productImages = p.images && p.images.length > 0 ? p.images : ['/product2.png', '/product1.png']
      try {
        const storedImgs = localStorage.getItem(`mk_prod_images_${p.productId ?? p.id}`)
        if (storedImgs) {
          const parsed = JSON.parse(storedImgs)
          if (Array.isArray(parsed) && parsed.length > 0) {
            productImages = parsed
          }
        }
      } catch (e) {
        console.error(e)
      }

      // Map variants to colors
      const productColors = []
      if (Array.isArray(p.variants)) {
        p.variants.forEach(v => {
          if (v.color) {
            const resolvedColor = apiColors.find(c => (c.colorId ?? c.id) === (v.colorId ?? v.color.colorId))
            const cName = resolvedColor?.name || v.color.name
            const cHex = resolvedColor?.hexCode || v.color.hexCode || '#000000'
            if (cName && !productColors.some(c => c.name.toLowerCase() === cName.toLowerCase())) {
              productColors.push({
                name: cName,
                hex: cHex,
                accent: cHex
              })
            }
          } else if (v.colorId) {
            const resolvedColor = apiColors.find(c => (c.colorId ?? c.id) === v.colorId)
            if (resolvedColor && !productColors.some(c => c.name.toLowerCase() === resolvedColor.name.toLowerCase())) {
              productColors.push({
                name: resolvedColor.name,
                hex: resolvedColor.hexCode || '#000000',
                accent: resolvedColor.hexCode || '#000000'
              })
            }
          }
        })
      }

      // Map variants to sizes
      const productSizes = []
      if (Array.isArray(p.variants)) {
        p.variants.forEach(v => {
          if (v.size) {
            const resolvedSize = apiSizes.find(s => (s.sizeId ?? s.id) === (v.sizeId ?? v.size.sizeId))
            const sName = resolvedSize?.name || v.size.name
            if (sName && !productSizes.includes(sName)) {
              productSizes.push(sName)
            }
          } else if (v.sizeId) {
            const resolvedSize = apiSizes.find(s => (s.sizeId ?? s.id) === v.sizeId)
            if (resolvedSize && !productSizes.includes(resolvedSize.name)) {
              productSizes.push(resolvedSize.name)
            }
          }
        })
      }

      return {
        id: p.productId ?? p.id,
        name: p.name,
        slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : String(p.id)),
        price: p.price,
        originalPrice: p.originalPrice || null,
        badge: p.badge || null,
        images: productImages,
        description: p.description || 'Premium athletic streetwear engineered for comfort and style.',
        sizes: productSizes.length > 0 ? productSizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: productColors.length > 0 ? productColors : [
          { name: 'Black / Volt', hex: '#0c0c0c', accent: '#c8f542' }
        ],
        inStock: p.stockQuantity > 0,
        rating: p.rating || 5.0,
        reviews: p.reviews || 0,
        tags: p.tags || [p.name?.toLowerCase() || ''],
        categories: categoriesArray,
        category: p.category || mainCat || 'activewear',
        subcategory: p.subcategory || '',
        deliveryInfo: p.deliveryInfo || 'Free delivery on orders over ₦75.',
        specs: p.specs || {
          material: 'Premium Blend',
          fit: 'Standard Fit',
          care: 'Machine wash 30°C'
        }
      }
    })

    return [...STATIC_PRODUCTS, ...mappedApi]
  }, [apiProducts, apiColors, apiSizes])

  const dynamicCategories = useMemo(() => {
    const list = ['All']
    STATIC_CATEGORIES.forEach(c => {
      if (c.label && !list.includes(c.label)) {
        list.push(c.label)
      }
    })
    apiCategories.forEach(c => {
      if (c.name && !list.some(m => m.toLowerCase() === c.name.toLowerCase())) {
        list.push(c.name)
      }
    })
    return list
  }, [apiCategories])

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
    // API Data
    products: mappedProducts,
    categories: dynamicCategories,
    apiLoading,
    fetchStoreData,
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
