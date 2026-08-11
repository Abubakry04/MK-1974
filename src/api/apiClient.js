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

async function request(method, path, body) {
  const isAuthPath = path.toLowerCase().includes('/auth/')

  if (!isAuthPath && _token && isTokenExpired(_token)) {
    handleSessionExpiration()
    const err = new Error('Your session has expired. Please sign in again.')
    err.status = 401
    throw err
  }

  const headers = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const primaryUrl = BASE_URL ? `${BASE_URL}${path}` : path
  let res

  try {
    res = await fetch(primaryUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (netErr) {
    if (!primaryUrl.startsWith('http')) {
      res = await fetch(`${DIRECT_BACKEND}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
    } else {
      throw netErr
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const text = await res.text()
      const d = safeParseJson(text)
      if (d) msg = d.message || d.title || msg
      else if (text && !text.trim().startsWith('<')) msg = text
    } catch {}

    if (res.status === 401) {
      if (isAuthPath) {
        const err = new Error(msg && !msg.startsWith('HTTP') ? msg : 'Invalid email or password. Please check your credentials.')
        err.status = 401
        throw err
      } else {
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
    const err = new Error('Your session has expired. Please sign in again.')
    err.status = 401
    throw err
  }

  const headers = {}
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const primaryUrl = BASE_URL ? `${BASE_URL}${path}` : path
  let res

  try {
    res = await fetch(primaryUrl, { method, headers, body: formData })
  } catch (netErr) {
    if (!primaryUrl.startsWith('http')) {
      res = await fetch(`${DIRECT_BACKEND}${path}`, { method, headers, body: formData })
    } else {
      throw netErr
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
    const err = new Error(res.status === 401 ? 'Your session has expired. Please sign in again.' : msg)
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
  getAll: () => request('GET', '/api/Product'),
  getById: (id) => request('GET', `/api/Product/${id}`),
}

export const categories = {
  getAll: () => request('GET', '/api/Category'),
}

export const colors = {
  getAll: () => request('GET', '/api/Color'),
}

export const sizes = {
  getAll: () => request('GET', '/api/Size'),
}

export const orders = {
  getAll: () => request('GET', '/api/Order'),
  getById: (id) => request('GET', `/api/Order/${id}`),
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
