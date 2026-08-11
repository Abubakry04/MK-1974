// ─── MK Brand API Client ───────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://mk-brand-api.onrender.com')

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

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

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

  console.log(`[requestFormData] ${method} ${BASE_URL}${path}`)
  for (const [key, val] of formData.entries()) {
    console.log(`  field: ${key} =`, val instanceof File ? `File(${val.name}, ${val.size}b, ${val.type})` : val)
  }

  const res = await fetch(`${BASE_URL}${path}`, { method, headers, body: formData })

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

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login:    (body) => request('POST', '/api/Auth/login', body),
  register: (body) => request('POST', '/api/Auth/register', body),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = {
  getAll:   (categoryId) => request('GET', `/api/Product${categoryId ? `?categoryId=${categoryId}` : ''}`),
  getOne:   (id)         => request('GET', `/api/Product/${id}`),
  create:   (body)       => request('POST', '/api/Product', body),
  update:   (id, body)   => request('PUT', `/api/Product/${id}`, body),
  remove:   (id)         => request('DELETE', `/api/Product/${id}`),
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = {
  getAll: () => request('GET', '/api/Category'),
  create: (body) => request('POST', '/api/Category', body),
  remove: (id)   => request('DELETE', `/api/Category/${id}`),
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const colors = {
  getAll: () => request('GET', '/api/Color'),
  create: (body) => request('POST', '/api/Color', body),
  remove: (id)   => request('DELETE', `/api/Color/${id}`),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = {
  create: (body) => request('POST', '/api/Order', body),
  getOne: (orderNumber) => request('GET', `/api/Order/${orderNumber}`),
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const payments = {
  submit: (orderNumber, receiptFile) => {
    const fd = new FormData()
    if (orderNumber) {
      fd.append('OrderNumber', String(orderNumber))
    }
    if (receiptFile && (receiptFile instanceof File || receiptFile instanceof Blob)) {
      fd.append('Receipt', receiptFile)
    }
    return requestFormData('POST', '/api/Payment/submit', fd)
  },
}

export const sizes = {
  getAll: () => request('GET', '/api/Size'),
  create: (body) => request('POST', '/api/Size', body),
  remove: (id)   => request('DELETE', `/api/Size/${id}`),
}
