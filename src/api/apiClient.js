// ─── MK Brand API Client ───────────────────────────────────────────────────────
const BASE_URL = ''

// Store the JWT token in memory (backed by localStorage)
let _token = localStorage.getItem('mk1974_admin_token') || null

export function setToken(token) {
  _token = token
  if (token) localStorage.setItem('mk1974_admin_token', token)
  else localStorage.removeItem('mk1974_admin_token')
}

export function getToken() {
  return _token
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const d = await res.json(); msg = d.message || d.title || msg } catch {}
    throw new Error(msg)
  }

  // Some DELETE endpoints return 200 with no body
  const text = await res.text()
  return text ? JSON.parse(text) : null
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

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const sizes = {
  getAll: () => request('GET', '/api/Size'),
  create: (body) => request('POST', '/api/Size', body),
  remove: (id)   => request('DELETE', `/api/Size/${id}`),
}
