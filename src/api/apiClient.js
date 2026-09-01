// ─── MK Brand API Client ───────────────────────────────────────────────────────
const DIRECT_BACKEND = 'https://mk-brand-api.onrender.com'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const TOKEN_KEY = 'mk1974_store_token'

function getInitialToken() {
  try {
    const storeToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    if (storeToken) return storeToken
    const userStr = localStorage.getItem('mk1974_user') || sessionStorage.getItem('mk1974_user')
    if (userStr) {
      const u = JSON.parse(userStr)
      if (u?.token) return u.token
    }
  } catch {}
  return null
}

let _token = getInitialToken()

export function setToken(token) {
  _token = token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

export function getToken() {
  return _token
}

export function isTokenExpired(token) {
  if (!token || typeof token !== 'string') return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload && payload.exp) {
      return payload.exp < Math.floor(Date.now() / 1000)
    }
  } catch {}
  return false
}

function handleSessionExpiration() {
  setToken(null)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth_session_expired'))
  }
}

function safeParseJson(text) {
  if (!text || typeof text !== 'string') return null
  const trimmed = text.trim()
  if (trimmed.startsWith('<')) return null
  try { return JSON.parse(trimmed) } catch { return null }
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastErr
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options)
      if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1200 * attempt))
        continue
      }
      return res
    } catch (err) {
      lastErr = err
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1200 * attempt))
      }
    }
  }
  throw lastErr
}

async function request(method, path, body, isPublic = false) {
  const isAuthPath = path.toLowerCase().includes('/auth/')
  const isGetMethod = method.toUpperCase() === 'GET'
  const isPublicRequest = isPublic || isGetMethod

  // If token is expired, clear session
  if (_token && isTokenExpired(_token)) {
    handleSessionExpiration()
    if (!isPublicRequest && !isAuthPath) {
      const err = new Error('Your session has expired. Please sign in again.')
      err.status = 401
      throw err
    }
  }

  const headers = { 'Content-Type': 'application/json' }
  const activeToken = getToken()
  if (activeToken && !isTokenExpired(activeToken)) {
    headers['Authorization'] = `Bearer ${activeToken}`
  }

  const primaryUrl = BASE_URL ? `${BASE_URL}${path}` : path
  const requestOptions = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  let res
  try {
    res = await fetchWithRetry(primaryUrl, requestOptions, 3)
  } catch (netErr) {
    if (!primaryUrl.startsWith('http')) {
      try {
        res = await fetchWithRetry(`${DIRECT_BACKEND}${path}`, requestOptions, 3)
      } catch (fallbackErr) {
        const err = new Error('Unable to connect to backend server. Please check your internet connection and try again.')
        err.originalError = fallbackErr
        throw err
      }
    } else {
      const err = new Error('Unable to connect to backend server. Please check your internet connection and try again.')
      err.originalError = netErr
      throw err
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    let rawText = ''
    try {
      rawText = await res.text()
      const d = safeParseJson(rawText)
      if (d) msg = d.message || d.title || d.detail || JSON.stringify(d)
      else if (rawText && !rawText.trim().startsWith('<')) msg = rawText
    } catch {}

    if (res.status === 500) {
      console.error(`[API ${res.status}] ${method} ${path} — Server response:`, rawText || msg)
    }

    if (res.status === 401) {
      if (isAuthPath) {
        const err = new Error(msg && !msg.startsWith('HTTP') ? msg : 'Invalid email or password. Please check your credentials.')
        err.status = 401
        throw err
      } else if (!isPublicRequest) {
        handleSessionExpiration()
        const err = new Error('Your session has expired. Please sign in again.')
        err.status = 401
        throw err
      }
    }

    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  const text = await res.text()
  return safeParseJson(text)
}

async function requestFormData(method, path, formData) {
  if (_token && isTokenExpired(_token)) {
    handleSessionExpiration()
  }

  const headers = {}
  const activeToken = getToken()
  if (activeToken && !isTokenExpired(activeToken)) {
    headers['Authorization'] = `Bearer ${activeToken}`
  }

  const primaryUrl = BASE_URL ? `${BASE_URL}${path}` : path
  const requestOptions = { method, headers, body: formData }

  let res
  try {
    res = await fetchWithRetry(primaryUrl, requestOptions, 3)
  } catch (netErr) {
    if (!primaryUrl.startsWith('http')) {
      try {
        res = await fetchWithRetry(`${DIRECT_BACKEND}${path}`, requestOptions, 3)
      } catch (fallbackErr) {
        const err = new Error('Unable to connect to backend server. Please check your internet connection and try again.')
        err.originalError = fallbackErr
        throw err
      }
    } else {
      const err = new Error('Unable to connect to backend server. Please check your internet connection and try again.')
      err.originalError = netErr
      throw err
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      handleSessionExpiration()
    }
    let msg = `HTTP ${res.status}`
    try {
      const text = await res.text()
      const d = safeParseJson(text)
      if (d) msg = d.message || d.title || d.error || (Array.isArray(d.errors) ? d.errors.join(', ') : msg)
      else if (text && !text.trim().startsWith('<')) msg = text
    } catch {}
    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  const text = await res.text()
  return safeParseJson(text)
}

// ─── API Endpoints ─────────────────────────────────────────────────────────────

export const auth = {
  login: (credentials) => request('POST', '/api/Auth/login', credentials),
  register: (userData) => request('POST', '/api/Auth/register', userData),
}

export const products = {
  getAll: async () => {
    try {
      return await request('GET', '/api/Product', undefined, true)
    } catch (e) {
      if (e.status === 404 || e.message?.includes('404')) {
        return await request('GET', '/api/Products', undefined, true)
      }
      throw e
    }
  },
  getById: async (id) => {
    try {
      return await request('GET', `/api/Product/${id}`, undefined, true)
    } catch (e) {
      if (e.status === 404 || e.message?.includes('404')) {
        return await request('GET', `/api/Products/${id}`, undefined, true)
      }
      throw e
    }
  },
}

export const categories = {
  getAll: () => request('GET', '/api/Category', undefined, true),
}

export const colors = {
  getAll: () => request('GET', '/api/Color', undefined, true),
}

export const sizes = {
  getAll: () => request('GET', '/api/Size', undefined, true),
}

export const orders = {
  getAll: () => request('GET', '/api/Order'),
  getById: (id) => request('GET', `/api/Order/${id}`, undefined, true),
  getByUser: (userId) => request('GET', `/api/Order/user/${userId}`, undefined, true),
  track: (id) => request('GET', `/api/Order/${id}`, undefined, true),
  create: (orderData) => request('POST', '/api/Order', orderData),
}

export const payments = {
  submit: (orderNumber, file) => {
    const fd = new FormData()
    fd.append('OrderNumber', orderNumber)
    if (file) {
      fd.append('file', file)
      fd.append('ReceiptFile', file)
      fd.append('Receipt', file)
    }
    return requestFormData('POST', '/api/Payment/submit', fd)
  },
}
