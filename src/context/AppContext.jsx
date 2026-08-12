import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import * as api from '../api/apiClient'

// ─── Context ──────────────────────────────────────────────────────────────────
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const API_BASE_URL = 'https://mk-brand-api.onrender.com'

export function formatSingleImageUrl(url) {
  if (!url) return null
  if (typeof url !== 'string') {
    if (typeof url === 'object' && url !== null) {
      url = url.url || url.imageUrl || url.imagePath || url.path || url.src || null
    }
  }
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  if (cleanPath.startsWith('/product') || cleanPath.startsWith('/hero') || cleanPath.startsWith('/assets') || cleanPath.startsWith('/logo')) {
    return cleanPath
  }
  return `${API_BASE_URL}${cleanPath}`
}

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'MK 1974 Heavyweight Oversized Tee',
    slug: 'mk-1974-heavyweight-oversized-tee',
    price: 35000,
    originalPrice: 45000,
    badge: 'Best Seller',
    images: ['/product1.png', '/product2.png', '/product3.png'],
    description: 'Cut from 280GSM heavy combed cotton. Crafted for an oversized silhouette with reinforced ribbed collar and drop shoulder construction. Made in Lagos.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Core Black', hex: '#111111' }, { name: 'Volt Green', hex: '#8AF522' }],
    inStock: true,
    rating: 4.9,
    reviews: 28,
    category: 'T-Shirts',
    specs: { material: '100% Heavyweight Cotton (280GSM)', fit: 'Oversized Boxy Fit', care: 'Machine wash cold' }
  },
  {
    id: 2,
    name: 'MK 1974 Signature Performance Tracksuit',
    slug: 'mk-1974-signature-performance-tracksuit',
    price: 85000,
    originalPrice: 105000,
    badge: 'Exclusive',
    images: ['/product2.png', '/product1.png', '/product3.png'],
    description: 'Architectural streetwear fleece tracksuit featuring custom hardware, deep zip pockets, and tapered cuff finishing for athletic mobility.',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Midnight Navy', hex: '#1B263B' }, { name: 'Core Black', hex: '#111111' }],
    inStock: true,
    rating: 5.0,
    reviews: 42,
    category: 'Tracksuits',
    specs: { material: 'Heavy Fleece Cotton Blend', fit: 'Athletic Tapered', care: 'Machine wash 30°C' }
  },
  {
    id: 3,
    name: 'MK 1974 Utility Street Joggers',
    slug: 'mk-1974-utility-street-joggers',
    price: 45000,
    originalPrice: 55000,
    badge: 'New',
    images: ['/product3.png', '/product1.png', '/product2.png'],
    description: 'Designed for daily movement across the city. Built with dual cargo flap pockets, elastic drawstring waist, and double-stitched stress seams.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Stealth Black', hex: '#1A1A1A' }, { name: 'Olive Green', hex: '#4A5D4E' }],
    inStock: true,
    rating: 4.8,
    reviews: 19,
    category: 'Joggers',
    specs: { material: 'Cotton Hybrid', fit: 'Relaxed Tapered', care: 'Wash with similar colors' }
  },
  {
    id: 4,
    name: 'MK 1974 Essential Street Hoodie',
    slug: 'mk-1974-essential-street-hoodie',
    price: 65000,
    originalPrice: 75000,
    badge: 'Sale',
    images: ['/hero_jersey.png', '/product2.png', '/product1.png'],
    description: 'Double-lined hood with heavyweight fleece body. Designed for structure and comfort without sacrificing street identity.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Core Black', hex: '#111111' }, { name: 'Heather Grey', hex: '#888888' }],
    inStock: true,
    rating: 4.9,
    reviews: 34,
    category: 'Hoodies',
    specs: { material: '400GSM Cotton Fleece', fit: 'Relaxed Fit', care: 'Cold hand wash' }
  }
]

export function formatProductImages(p) {
  if (!p) return []
  const list = []

  const singleProps = [
    p.imageUrl, p.image, p.primaryImageUrl, p.thumbnail, p.coverImage, p.photoUrl,
    p.ImageUrl, p.Image, p.PrimaryImageUrl
  ]
  for (const item of singleProps) {
    const formatted = formatSingleImageUrl(item)
    if (formatted && !list.includes(formatted)) {
      list.push(formatted)
    }
  }

  const arrayProps = [p.images, p.imageUrls, p.Images, p.ImageUrls]
  for (const arr of arrayProps) {
    if (Array.isArray(arr) && arr.length > 0) {
      for (const item of arr) {
        const formatted = formatSingleImageUrl(item)
        if (formatted && !list.includes(formatted)) {
          list.push(formatted)
        }
      }
    }
  }

  try {
    const pId = p.productId ?? p.id
    if (pId) {
      const storedImgs = localStorage.getItem(`mk_prod_images_${pId}`)
      if (storedImgs) {
        const parsed = JSON.parse(storedImgs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          for (const item of parsed) {
            const formatted = formatSingleImageUrl(item)
            if (formatted && !list.includes(formatted)) {
              list.push(formatted)
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  return list
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── API data ──
  const [apiProducts, setApiProducts] = useState([])
  const [apiCategories, setApiCategories] = useState([])
  const [apiColors, setApiColors] = useState([])
  const [apiSizes, setApiSizes] = useState([])
  const [apiLoading, setApiLoading] = useState(false)

  const extractArray = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (Array.isArray(res.data?.results)) return res.data.results
    if (Array.isArray(res.data?.items)) return res.data.items
    if (Array.isArray(res.data?.$values)) return res.data.$values
    if (Array.isArray(res.data)) return res.data
    if (Array.isArray(res.results)) return res.results
    if (Array.isArray(res.items)) return res.items
    if (Array.isArray(res.$values)) return res.$values
    return []
  }

  const fetchStoreData = useCallback(async () => {
    setApiLoading(true)
    try {
      const [prods, cats, cols, szs] = await Promise.all([
        api.products.getAll().catch(err => { console.error("Failed to fetch products", err); return []; }),
        api.categories.getAll().catch(err => { console.error("Failed to fetch categories", err); return []; }),
        api.colors.getAll().catch(err => { console.error("Failed to fetch colors", err); return []; }),
        api.sizes.getAll().catch(err => { console.error("Failed to fetch sizes", err); return []; }),
      ])
      const parsedProds = extractArray(prods)
      const parsedCats = extractArray(cats)
      const parsedCols = extractArray(cols)
      const parsedSzs = extractArray(szs)

      setApiProducts(parsedProds)
      setApiCategories(parsedCats.map(c => ({
        ...c,
        id: c.categoryId ?? c.id,
        name: typeof c === 'string' ? c : (c.name || String(c.id))
      })))
      setApiColors(parsedCols)
      setApiSizes(parsedSzs)
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
      const categoriesArray = (p.categories || []).map(c => {
        if (typeof c === 'string') return { id: c, name: c }
        return { ...c, id: c.categoryId ?? c.id, name: c.name || String(c.id || '') }
      })
      const mainCat = categoriesArray.length > 0 ? categoriesArray[0].name : ''

      // Format all images from API (direct fields, imageUrls, images)
      const formattedImgs = formatProductImages(p)
      const productImages = formattedImgs

      // Map variants & product fields to colors
      const productColors = []

      // 1. Direct colors on product (if available)
      const rawColors = p.colors || p.productColors || p.selectedColors || []
      if (Array.isArray(rawColors)) {
        rawColors.forEach(cItem => {
          if (typeof cItem === 'string') {
            const resolvedColor = apiColors.find(ac => ac.name?.toLowerCase() === cItem.toLowerCase())
            const name = resolvedColor?.name || cItem
            const hex = resolvedColor?.hexCode || resolvedColor?.hex || '#000000'
            if (!productColors.some(x => x.name.toLowerCase() === name.toLowerCase())) {
              productColors.push({ name, hex, accent: hex })
            }
          } else if (typeof cItem === 'number' || (typeof cItem === 'string' && !isNaN(cItem))) {
            const resolvedColor = apiColors.find(ac => String(ac.colorId ?? ac.id) === String(cItem))
            if (resolvedColor) {
              const name = resolvedColor.name
              const hex = resolvedColor.hexCode || resolvedColor.hex || '#000000'
              if (!productColors.some(x => x.name.toLowerCase() === name.toLowerCase())) {
                productColors.push({ name, hex, accent: hex })
              }
            }
          } else if (cItem && typeof cItem === 'object') {
            const name = cItem.name || cItem.colorName || String(cItem.colorId ?? cItem.id ?? '')
            const hex = cItem.hexCode || cItem.hex || cItem.accent || '#000000'
            if (name && !productColors.some(x => x.name.toLowerCase() === name.toLowerCase())) {
              productColors.push({ name, hex, accent: hex })
            }
          }
        })
      }

      // 2. Variants array on product
      const variantsArr = p.variants || p.productVariants || p.rawVariants || []
      if (Array.isArray(variantsArr)) {
        variantsArr.forEach(v => {
          let cName = ''
          let cHex = ''

          if (v.color && typeof v.color === 'object') {
            cName = v.color.name || v.color.colorName || ''
            cHex = v.color.hexCode || v.color.hex || ''
            const targetId = v.colorId ?? v.color.colorId ?? v.color.id
            const resolvedColor = apiColors.find(ac => String(ac.colorId ?? ac.id) === String(targetId))
            if (resolvedColor) {
              cName = cName || resolvedColor.name
              cHex = cHex || resolvedColor.hexCode || resolvedColor.hex
            }
          } else if (v.color && typeof v.color === 'string') {
            cName = v.color
            const resolvedColor = apiColors.find(ac => ac.name?.toLowerCase() === v.color.toLowerCase())
            if (resolvedColor) {
              cHex = resolvedColor.hexCode || resolvedColor.hex || '#000000'
            }
          } else if (v.colorId != null) {
            const resolvedColor = apiColors.find(ac => String(ac.colorId ?? ac.id) === String(v.colorId))
            if (resolvedColor) {
              cName = resolvedColor.name
              cHex = resolvedColor.hexCode || resolvedColor.hex || '#000000'
            }
          } else if (v.colorName) {
            cName = v.colorName
            cHex = v.colorHex || '#000000'
          }

          if (cName && !productColors.some(c => c.name.toLowerCase() === cName.toLowerCase())) {
            productColors.push({
              name: cName,
              hex: cHex || '#000000',
              accent: cHex || '#000000'
            })
          }
        })
      }

      // Map variants & product fields to sizes
      const productSizes = []
      const rawSizes = p.sizes || p.productSizes || p.selectedSizes || []
      if (Array.isArray(rawSizes)) {
        rawSizes.forEach(sItem => {
          if (typeof sItem === 'string') {
            if (!productSizes.includes(sItem)) productSizes.push(sItem)
          } else if (typeof sItem === 'number' || (typeof sItem === 'string' && !isNaN(sItem))) {
            const resolvedSize = apiSizes.find(as => String(as.sizeId ?? as.id) === String(sItem))
            if (resolvedSize && !productSizes.includes(resolvedSize.name)) {
              productSizes.push(resolvedSize.name)
            }
          } else if (sItem && typeof sItem === 'object') {
            const name = sItem.name || sItem.sizeName || String(sItem.sizeId ?? sItem.id ?? '')
            if (name && !productSizes.includes(name)) productSizes.push(name)
          }
        })
      }

      if (Array.isArray(variantsArr)) {
        variantsArr.forEach(v => {
          let sName = ''
          if (v.size && typeof v.size === 'object') {
            sName = v.size.name || v.size.sizeName || ''
            const targetId = v.sizeId ?? v.size.sizeId ?? v.size.id
            const resolvedSize = apiSizes.find(as => String(as.sizeId ?? as.id) === String(targetId))
            if (resolvedSize) sName = sName || resolvedSize.name
          } else if (v.size && typeof v.size === 'string') {
            sName = v.size
          } else if (v.sizeId != null) {
            const resolvedSize = apiSizes.find(as => String(as.sizeId ?? as.id) === String(v.sizeId))
            if (resolvedSize) sName = resolvedSize.name
          } else if (v.sizeName) {
            sName = v.sizeName
          }

          if (sName && !productSizes.includes(sName)) {
            productSizes.push(sName)
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
        description: p.description || '',
        sizes: productSizes,
        colors: productColors,
        inStock: p.stockQuantity > 0,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        tags: p.tags || [p.name?.toLowerCase() || ''],
        categories: categoriesArray,
        category: p.category || mainCat || '',
        subcategory: p.subcategory || '',
        deliveryInfo: p.deliveryInfo || 'Standard nationwide delivery available across Nigeria.',
        specs: p.specs || {
          material: 'Premium Blend',
          fit: 'Standard Fit',
          care: 'Machine wash 30°C'
        },
        rawVariants: p.variants || []
      }
    })

    return mappedApi.length > 0 ? mappedApi : FALLBACK_PRODUCTS
  }, [apiProducts, apiColors, apiSizes])

  const dynamicCategories = useMemo(() => {
    const list = ['All']
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
    try { 
      // Check localStorage first, fallback to sessionStorage if legacy session exists
      const stored = localStorage.getItem('mk1974_user') || sessionStorage.getItem('mk1974_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  // Restore token if user exists
  useEffect(() => {
    if (user?.token) {
      api.setToken(user.token)
    } else {
      api.setToken(null)
    }
  }, [user])

// Listen for storage changes across tabs (e.g. logging out in one tab syncs across all tabs)
  function parseJwtPayload(token) {
    if (!token || typeof token !== 'string') return null
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return null
    }
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'mk1974_user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newUser)
          if (newUser?.token) api.setToken(newUser.token)
          else api.setToken(null)
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = useCallback(async (credentials) => {
    try {
      const data = await api.auth.login({
        email: credentials.email,
        password: credentials.password,
      })
      const token = typeof data === 'string' ? data : (data?.token || data?.accessToken || data?.jwt)
      if (token) api.setToken(token)

      const decoded = parseJwtPayload(token)
      const phoneFromJwt = decoded?.mobilephone || decoded?.phone_number || decoded?.phoneNumber || decoded?.phone || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone']

      const userPhone = data?.phoneNumber || data?.phone || data?.PhoneNumber || data?.Phone || phoneFromJwt || credentials.phoneNumber || credentials.phone || ''

      const clientData = {
        id: data?.userId || data?.id || decoded?.nameid || decoded?.sub || '1',
        email: credentials.email || data?.email || decoded?.email || '',
        firstName: data?.firstName || data?.FirstName || decoded?.given_name || decoded?.name || 'User',
        lastName: data?.lastName || data?.LastName || decoded?.family_name || '',
        phoneNumber: userPhone,
        phone: userPhone,
        role: data?.role || decoded?.role || 'Customer',
        token,
      }
      setUser(clientData)
      localStorage.setItem('mk1974_user', JSON.stringify(clientData))
      sessionStorage.setItem('mk1974_user', JSON.stringify(clientData))
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
    sessionStorage.removeItem('mk1974_user')
    showToast('You have been logged out.')
  }, [showToast])

  // Auto-logout when session expires or backend returns HTTP 401
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('[AppContext] Session expired — logging out customer automatically.')
      setUser(null)
      api.setToken(null)
      localStorage.removeItem('mk1974_user')
      sessionStorage.removeItem('mk1974_user')
      showToast('Your session has expired. Please sign in again.', 'error')
    }
    window.addEventListener('auth_session_expired', handleSessionExpired)
    return () => window.removeEventListener('auth_session_expired', handleSessionExpired)
  }, [showToast])

  const register = useCallback(async (userData) => {
    try {
      // Always force role to Customer — never allow Staff or Admin from the storefront
      const { role: _ignored, ...safeUserData } = userData
      const safePhone = safeUserData.phoneNumber || safeUserData.phone || ''

      await api.auth.register({
        firstName: safeUserData.firstName,
        lastName: safeUserData.lastName,
        email: safeUserData.email,
        phoneNumber: safePhone,
        phone: safePhone,
        PhoneNumber: safePhone,
        Phone: safePhone,
        password: safeUserData.password,
        role: 'Customer',
        Role: 'Customer',
      })
      
      // Auto login
      const result = await login({
        email: userData.email,
        password: userData.password,
        phoneNumber: safePhone,
        phone: safePhone,
      })
      if (!result.success) {
        showToast('Registration successful! Please log in.')
      } else {
        showToast(`Welcome to MK 1974, ${safeUserData.firstName}!`)
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

function extractOrderNumber(res) {
  if (res === null || res === undefined) return null
  if (typeof res === 'number' || typeof res === 'string') return String(res)
  
  const d = res.data ?? res.result ?? res.order ?? res
  if (typeof d === 'number' || typeof d === 'string') return String(d)

  const candidate = 
    d.orderNumber ?? d.OrderNumber ?? d.ordernumber ??
    d.orderId ?? d.OrderId ?? d.orderid ??
    d.id ?? d.Id ?? d.ID ??
    d.orderRef ?? d.OrderRef ?? d.reference ?? d.Reference ??
    d.code ?? d.Code

  if (candidate !== undefined && candidate !== null && String(candidate).trim() !== '') {
    return String(candidate)
  }
  return null
}

  const createOrder = useCallback(async (orderData) => {
    if (user?.token) {
      api.setToken(user.token)
    }

    const itemsPayload = cart.map(item => {
      const variant = item.product.rawVariants?.find(v => {
        const vColorName = v.color?.name || apiColors.find(c => String(c.colorId ?? c.id) === String(v.colorId))?.name
        const vSizeName = v.size?.name || apiSizes.find(s => String(s.sizeId ?? s.id) === String(v.sizeId))?.name
        return vColorName?.toLowerCase() === item.color.toLowerCase() && vSizeName?.toLowerCase() === item.size.toLowerCase()
      })
      return {
        productVariantId: variant ? (variant.productVariantId ?? variant.id) : (item.product.rawVariants?.[0]?.productVariantId ?? item.product.rawVariants?.[0]?.id ?? 1),
        quantity: item.qty,
        price: item.price,
        orderDate: new Date().toISOString()
      }
    })
    
    const shippingAmount = orderData?.shipping ?? orderData?.shippingFee ?? 3000
    const discountVal = orderData?.discount ?? orderData?.discountAmount ?? 0
    const finalTotal = orderData?.totalAmount ?? (cartTotal + shippingAmount - discountVal)

    const payload = {
      userId: parseInt(user?.id) || 1,
      shipping: shippingAmount,
      shippingFee: shippingAmount,
      shippingCost: shippingAmount,
      deliveryFee: shippingAmount,
      discount: discountVal,
      discountAmount: discountVal,
      totalAmount: finalTotal,
      total: finalTotal,
      address: orderData?.address || '',
      city: orderData?.city || '',
      state: orderData?.state || 'Lagos',
      phone: orderData?.phone || '',
      items: itemsPayload
    }

    let createdFromApi = null
    try {
      createdFromApi = await api.orders.create(payload)
      console.log('[POST /api/Order Success Response]:', createdFromApi)
    } catch (e) {
      console.error('[POST /api/Order Failed]:', e)
      if (e.status === 401 || e.message?.includes('401') || e.message?.toLowerCase().includes('token')) {
        logout()
        throw new Error('Your login session has expired. Please sign in again.')
      }
      throw new Error(e.message || 'Failed to create order on server.')
    }

    const orderNumber = extractOrderNumber(createdFromApi)
    if (!orderNumber) {
      console.error('[createOrder] Response missing order number:', createdFromApi)
      throw new Error('Order creation succeeded, but server response format was unrecognized.')
    }

    return { orderNumber, createdData: createdFromApi }
  }, [cart, cartTotal, user, apiColors, apiSizes, logout])

  const submitOrderPayment = useCallback(async (orderNumber, receiptFile, orderData) => {
    if (user?.token) {
      api.setToken(user.token)
    }

    if (!orderNumber) {
      throw new Error('No valid Order Number provided for payment submission.')
    }

    const shippingAmount = orderData?.shipping ?? orderData?.shippingFee ?? 3000
    const discountVal = orderData?.discount ?? orderData?.discountAmount ?? 0
    const finalTotal = orderData?.totalAmount ?? (cartTotal + shippingAmount - discountVal)

    // Call Payment endpoint POST /api/Payment/submit with the parsed OrderNumber
    try {
      console.log(`[POST /api/Payment/submit] Submitting for OrderNumber: ${orderNumber}, Receipt:`, receiptFile?.name || 'None')
      await api.payments.submit(orderNumber, receiptFile || null)
    } catch (payErr) {
      console.error('[POST /api/Payment/submit Error]:', payErr)
      throw new Error(payErr.message || 'Failed to submit payment receipt.')
    }

    const newOrder = {
      id: orderNumber,
      userId: user?.id || null,
      userEmail: user?.email || orderData.email || null,
      ...orderData,
      items: [...cart],
      subtotal: cartTotal,
      shipping: shippingAmount,
      shippingFee: shippingAmount,
      discount: discountVal,
      total: finalTotal,
      totalAmount: finalTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'pending', label: 'Pending Payment Verification', date: new Date().toISOString(), done: true },
        { status: 'paid', label: 'Payment Confirmed', date: null, done: false },
        { status: 'cancelled', label: 'Cancelled', date: null, done: false },
        { status: 'failed', label: 'Failed', date: null, done: false },
        { status: 'refunded', label: 'Refunded', date: null, done: false },
      ],
    }

    setOrders(prev => {
      const updated = [newOrder, ...prev]
      localStorage.setItem('mk1974_orders', JSON.stringify(updated))
      return updated
    })
    clearCart()
    return newOrder
  }, [cart, cartTotal, clearCart, user])

  const placeOrder = useCallback(async (orderData) => {
    const { orderNumber } = await createOrder(orderData)
    return await submitOrderPayment(orderNumber, orderData.receiptFile, orderData)
  }, [createOrder, submitOrderPayment])


  // ── Recently Viewed ──
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_recently_viewed') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('mk1974_recently_viewed', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      return [product, ...filtered].slice(0, 6)
    })
  }, [])

  // ── Search ──
  const [searchOpen, setSearchOpen] = useState(false)

  // ── UI ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userOrders = useMemo(() => {
    if (!user) return []
    return orders.filter(o => {
      const matchUserId = o.userId && String(o.userId) === String(user.id)
      const matchEmail = (o.email || o.userEmail) && user.email && (o.email || o.userEmail).toLowerCase().trim() === user.email.toLowerCase().trim()
      const matchFirstName = o.firstName && user.firstName && o.firstName.toLowerCase().trim() === user.firstName.toLowerCase().trim()
      return matchUserId || matchEmail || matchFirstName
    })
  }, [orders, user])

  const fetchOrderTracking = useCallback(async (orderId) => {
    if (!orderId) return null
    const cleanId = String(orderId).trim()
    try {
      console.log(`[GET /api/Order/${cleanId}] Fetching live order tracking details...`)
      let raw = await api.orders.getById(cleanId).catch(() => null)
      
      // If direct lookup returns null/404, fallback to fetching all orders GET /api/Order
      if (!raw) {
        const all = await api.orders.getAll().catch(() => null)
        const arr = Array.isArray(all) ? all : (Array.isArray(all?.data) ? all.data : (Array.isArray(all?.$values) ? all.$values : []))
        raw = arr.find(o => {
          const num = extractOrderNumber(o) || String(o.id || o.orderId || '')
          return num.toLowerCase().trim() === cleanId.toLowerCase()
        })
      }

      if (raw) {
        const obj = raw.data ?? raw.result ?? raw.order ?? raw
        const rawStatus = obj.status ?? obj.orderStatus ?? obj.paymentStatus ?? obj.Status ?? obj.OrderStatus
        return {
          id: extractOrderNumber(obj) || cleanId,
          status: rawStatus || 'Pending Payment',
          total: obj.totalAmount ?? obj.total ?? obj.TotalAmount ?? obj.Total ?? 0,
          createdAt: obj.orderDate ?? obj.createdAt ?? obj.OrderDate ?? new Date().toISOString(),
          items: obj.items ?? obj.orderItems ?? [],
          ...obj
        }
      }
    } catch (err) {
      console.warn(`[Order Tracking API] Could not fetch order ${cleanId} from backend:`, err.message)
    }
    return null
  }, [])

  const value = {
    // API Data
    products: mappedProducts,
    categories: dynamicCategories,
    apiCategories,
    apiLoading,
    fetchStoreData,
    // Cart
    cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
    // Wishlist
    wishlist, toggleWishlist, isWishlisted,
    // Auth
    user, login, logout, register,
    // Orders
    orders: userOrders, allOrders: orders, placeOrder, createOrder, submitOrderPayment, fetchOrderTracking,
    // Toast
    toast, showToast,
    // Search
    searchOpen, setSearchOpen,
    // Recently viewed
    recentlyViewed, addToRecentlyViewed,
    // UI
    mobileMenuOpen, setMobileMenuOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
