import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import * as api from '../api/apiClient'

// ─── Admin Context ─────────────────────────────────────────────────────────────
export const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

// ─── Mock-only data (not yet in API) ──────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'MK100281', customer: 'Marcus Thompson', email: 'marcus.t@mail.com', items: 3, total: 278, status: 'delivered', date: '2025-06-18', country: 'UK' },
  { id: 'MK100280', customer: 'Leila Rahman', email: 'leila.r@mail.com', items: 1, total: 89, status: 'processing', date: '2025-06-17', country: 'UK' },
  { id: 'MK100279', customer: 'Jordan K.', email: 'jordan.k@mail.com', items: 2, total: 154, status: 'awaiting_payment', date: '2025-06-17', country: 'UK' },
  { id: 'MK100278', customer: 'Amara Osei', email: 'amara.o@mail.com', items: 1, total: 129, status: 'shipped', date: '2025-06-16', country: 'Ghana' },
  { id: 'MK100277', customer: 'David Park', email: 'david.p@mail.com', items: 4, total: 342, status: 'delivered', date: '2025-06-15', country: 'USA' },
  { id: 'MK100276', customer: 'Sophie Clarke', email: 'sophie.c@mail.com', items: 2, total: 168, status: 'cancelled', date: '2025-06-14', country: 'UK' },
  { id: 'MK100275', customer: 'Malik Johnson', email: 'malik.j@mail.com', items: 1, total: 79, status: 'delivered', date: '2025-06-13', country: 'Canada' },
  { id: 'MK100274', customer: 'Yasmin Ali', email: 'yasmin.a@mail.com', items: 3, total: 223, status: 'processing', date: '2025-06-13', country: 'UAE' },
]

const MOCK_CUSTOMERS = [
  { id: 'CU001', name: 'Marcus Thompson', email: 'marcus.t@mail.com', orders: 7, totalSpent: 834, lastOrder: '2025-06-18', status: 'vip', joined: '2024-01-12' },
  { id: 'CU002', name: 'Leila Rahman', email: 'leila.r@mail.com', orders: 3, totalSpent: 267, lastOrder: '2025-06-17', status: 'active', joined: '2024-03-05' },
  { id: 'CU003', name: 'Jordan K.', email: 'jordan.k@mail.com', orders: 5, totalSpent: 512, lastOrder: '2025-06-17', status: 'active', joined: '2024-02-18' },
  { id: 'CU004', name: 'Amara Osei', email: 'amara.o@mail.com', orders: 2, totalSpent: 258, lastOrder: '2025-06-16', status: 'active', joined: '2024-06-01' },
  { id: 'CU005', name: 'David Park', email: 'david.p@mail.com', orders: 11, totalSpent: 1420, lastOrder: '2025-06-15', status: 'vip', joined: '2023-11-22' },
  { id: 'CU006', name: 'Sophie Clarke', email: 'sophie.c@mail.com', orders: 1, totalSpent: 168, lastOrder: '2025-06-14', status: 'inactive', joined: '2025-06-10' },
]

const MOCK_REVIEWS = [
  { id: 'R001', customer: 'Marcus T.', product: 'Apex Full Tracksuit', rating: 5, text: "The Apex Tracksuit is genuinely the best quality I've had.", date: '2025-06-18', status: 'approved' },
  { id: 'R002', customer: 'Leila R.', product: 'Motion Jogger Set', rating: 5, text: 'Finally a brand that understands streetwear.', date: '2025-06-17', status: 'approved' },
  { id: 'R003', customer: 'Jordan K.', product: 'Strike Hoodie', rating: 5, text: "Bought the Strike Hoodie on a whim and now I can't stop wearing it.", date: '2025-06-16', status: 'pending' },
  { id: 'R004', customer: 'Anon User', product: 'Volt Track Jacket', rating: 2, text: 'Sizing ran small. Had to return.', date: '2025-06-15', status: 'pending' },
  { id: 'R005', customer: 'Sophie C.', product: 'Terra Fleece Set', rating: 4, text: 'Great quality, comfortable fit. Slightly slow delivery.', date: '2025-06-14', status: 'approved' },
]

const MOCK_STAFF = [
  { id: 'ST001', name: 'Mohammed K.', email: 'mo@mk1974.com', role: 'Super Admin', lastLogin: '2025-06-19', status: 'active' },
  { id: 'ST002', name: 'Aisha D.', email: 'aisha@mk1974.com', role: 'Product Manager', lastLogin: '2025-06-18', status: 'active' },
  { id: 'ST003', name: 'Tariq N.', email: 'tariq@mk1974.com', role: 'Operations', lastLogin: '2025-06-17', status: 'active' },
  { id: 'ST004', name: 'Kira W.', email: 'kira@mk1974.com', role: 'Customer Support', lastLogin: '2025-06-15', status: 'active' },
]

const MOCK_DISCOUNTS = [
  { id: 'DC001', code: 'VOLT20', type: 'percentage', value: 20, used: 142, limit: 500, status: 'active', expires: '2025-08-01' },
  { id: 'DC002', code: 'SUMMER10', type: 'percentage', value: 10, used: 89, limit: 1000, status: 'active', expires: '2025-09-01' },
  { id: 'DC003', code: 'FIRSTORDER', type: 'fixed', value: 15, used: 234, limit: null, status: 'active', expires: null },
  { id: 'DC004', code: 'FLASH50', type: 'percentage', value: 50, used: 500, limit: 500, status: 'expired', expires: '2025-05-01' },
]

const MOCK_ANALYTICS = {
  revenue: [8200, 9400, 11200, 10800, 13400, 15600, 14200, 16800, 18200, 17400, 20100, 22800],
  orders: [64, 72, 88, 82, 104, 121, 109, 132, 144, 138, 158, 178],
  months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  topProducts: [
    { name: 'Apex Full Tracksuit', sold: 312, revenue: 40248 },
    { name: 'Motion Jogger Set', sold: 278, revenue: 20850 },
    { name: 'Strike Hoodie', sold: 234, revenue: 18486 },
    { name: 'Volt Track Jacket', sold: 189, revenue: 16821 },
    { name: 'Terra Fleece Set', sold: 112, revenue: 10640 },
  ],
  traffic: [
    { source: 'Organic Search', pct: 42 },
    { source: 'Direct', pct: 28 },
    { source: 'Social Media', pct: 18 },
    { source: 'Email', pct: 8 },
    { source: 'Referral', pct: 4 },
  ],
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminProvider({ children }) {
  // ── Admin auth ──
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mk1974_admin') || 'null') } catch { return null }
  })

  // ── UI state ──
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // ── Live API data ──
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  // ── Mock-only data ──
  const [orders, setOrders] = useState(() => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('mk1974_orders') || '[]')
      const formattedLocal = localOrders.map(o => ({
        id: o.id,
        customer: `${o.firstName} ${o.lastName}`,
        email: o.email,
        items: o.items ? o.items.reduce((sum, item) => sum + item.qty, 0) : 0,
        total: o.total,
        status: o.status,
        date: o.createdAt ? o.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        country: o.country || 'Nigeria'
      }))
      return [...formattedLocal, ...MOCK_ORDERS]
    } catch {
      return MOCK_ORDERS
    }
  })
  const [customers] = useState(MOCK_CUSTOMERS)
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [staff] = useState(MOCK_STAFF)
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS)

  // ─── Load live data once authenticated ────────────────────────────────────
  useEffect(() => {
    if (!adminUser) return
    fetchAllApiData()
  }, [adminUser])

  const fetchAllApiData = useCallback(async () => {
    setApiLoading(true)
    setApiError(null)
    try {
      const [prods, cats, cols, szs] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
        api.colors.getAll(),
        api.sizes.getAll(),
      ])
      setProducts(Array.isArray(prods) ? prods : [])
      setCategories(Array.isArray(cats) ? cats : [])
      setColors(Array.isArray(cols) ? cols : [])
      setSizes(Array.isArray(szs) ? szs : [])
    } catch (err) {
      console.error('[Admin API] Failed to load data:', err)
      setApiError(err.message)
    } finally {
      setApiLoading(false)
    }
  }, [])

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const adminLogin = useCallback(async (credentials) => {
    try {
      const data = await api.auth.login({
        email: credentials.email,
        password: credentials.password,
      })
      // API returns a token (string) or an object with a token field
      const token = typeof data === 'string' ? data : (data?.token || data?.accessToken || data?.jwt)
      if (token) api.setToken(token)

      // Build admin user object from response or credentials
      const adminData = {
        email: credentials.email,
        name: data?.firstName ? `${data.firstName} ${data.lastName}` : (data?.name || credentials.email.split('@')[0]),
        role: data?.role || 'Admin',
        avatar: (data?.firstName?.[0] || credentials.email[0]).toUpperCase(),
        token,
        rawResponse: data,
      }
      setAdminUser(adminData)
      localStorage.setItem('mk1974_admin', JSON.stringify(adminData))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Check your credentials.' }
    }
  }, [])

  const adminLogout = useCallback(() => {
    setAdminUser(null)
    api.setToken(null)
    localStorage.removeItem('mk1974_admin')
    localStorage.removeItem('mk1974_admin_token')
    setProducts([])
    setCategories([])
    setColors([])
    setSizes([])
    setActiveSection('dashboard')
  }, [])

  // ─── Product CRUD ─────────────────────────────────────────────────────────
  const createProduct = useCallback(async (body) => {
    const data = await api.products.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const updateProduct = useCallback(async (id, body) => {
    const data = await api.products.update(id, body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteProduct = useCallback(async (id) => {
    await api.products.remove(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  // ─── Category CRUD ────────────────────────────────────────────────────────
  const createCategory = useCallback(async (body) => {
    const data = await api.categories.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteCategory = useCallback(async (id) => {
    await api.categories.remove(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  // ─── Color CRUD ───────────────────────────────────────────────────────────
  const createColor = useCallback(async (body) => {
    const data = await api.colors.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteColor = useCallback(async (id) => {
    await api.colors.remove(id)
    setColors(prev => prev.filter(c => c.id !== id))
  }, [])

  // ─── Size CRUD ────────────────────────────────────────────────────────────
  const createSize = useCallback(async (body) => {
    const data = await api.sizes.create(body)
    await fetchAllApiData()
    return data
  }, [fetchAllApiData])

  const deleteSize = useCallback(async (id) => {
    await api.sizes.remove(id)
    setSizes(prev => prev.filter(s => s.id !== id))
  }, [])

  // ─── Order / Review / Discount helpers (mock) ─────────────────────────────
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o)
      try {
        const localOrders = JSON.parse(localStorage.getItem('mk1974_orders') || '[]')
        const updatedLocal = localOrders.map(o => {
          if (o.id === orderId) {
            const statusOrder = ['awaiting_payment', 'payment_confirmed', 'processing', 'ready_for_delivery', 'delivered']
            let targetStatus = status
            if (status === 'shipped') targetStatus = 'ready_for_delivery'
            const targetIdx = statusOrder.indexOf(targetStatus)
            const updatedTimeline = o.timeline ? o.timeline.map(t => {
              const currentIdx = statusOrder.indexOf(t.status)
              if (currentIdx <= targetIdx) {
                return { ...t, done: true, date: t.date || new Date().toISOString() }
              }
              return { ...t, done: false, date: null }
            }) : []
            return { ...o, status: targetStatus, timeline: updatedTimeline }
          }
          return o
        })
        localStorage.setItem('mk1974_orders', JSON.stringify(updatedLocal))
      } catch (err) {
        console.error(err)
      }
      return next
    })
  }, [])

  const approveReview = useCallback((reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r))
  }, [])

  const deleteReview = useCallback((reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }, [])

  const toggleDiscount = useCallback((discountId) => {
    setDiscounts(prev => prev.map(d =>
      d.id === discountId ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ))
  }, [])

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = {
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    pendingOrders: orders.filter(o => ['processing', 'awaiting_payment'].includes(o.status)).length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
  }

  const value = {
    // Auth
    adminUser, adminLogin, adminLogout,
    // UI
    activeSection, setActiveSection,
    sidebarCollapsed, setSidebarCollapsed,
    // Live API data
    products, categories, colors, sizes,
    apiLoading, apiError, fetchAllApiData,
    // Product CRUD
    createProduct, updateProduct, deleteProduct,
    // Category CRUD
    createCategory, deleteCategory,
    // Color CRUD
    createColor, deleteColor,
    // Size CRUD
    createSize, deleteSize,
    // Mock data
    orders, customers, reviews, staff, discounts,
    // Helpers
    stats, analytics: MOCK_ANALYTICS,
    updateOrderStatus, approveReview, deleteReview, toggleDiscount,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
