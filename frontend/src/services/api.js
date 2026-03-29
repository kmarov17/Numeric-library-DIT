const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '') ?? ''
const TOKEN_STORAGE_KEY = 'dit-library-access-token'

function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function request(path, options = {}) {
  const token = options.token ?? getStoredToken()
  const headers = {
    ...(options.headers ?? {}),
  }

  if (!options.skipJsonContentType) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const payload = await response.json()
      const message =
        payload?.detail ||
        payload?.message ||
        payload?.error ||
        `Erreur API ${response.status} sur ${path}`
      const error = new Error(message)
      error.status = response.status
      throw error
    }

    const message = await response.text()
    const error = new Error(message || `Erreur API ${response.status} sur ${path}`)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      API_BASE_URL
        ? `La réponse n'est pas un JSON valide`
        : 'Erreur API',
    )
  }

  return response.json()
}

function unwrapCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

async function fetchAllPages(path) {
  const firstPage = await request(`${path}/`)

  if (Array.isArray(firstPage)) {
    return firstPage
  }

  const items = Array.isArray(firstPage?.items) ? [...firstPage.items] : []
  const totalPages = Number(firstPage?.pages ?? 1)

  if (totalPages <= 1) {
    return items
  }

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2)
  const payloads = await Promise.all(
    remainingPages.map((page) => request(`${path}/?page=${page}&limit=10`)),
  )

  payloads.forEach((payload) => {
    if (Array.isArray(payload?.items)) {
      items.push(...payload.items)
    }
  })

  return items
}

export function loginUser(credentials) {
  const body = new URLSearchParams({
    username: credentials.email,
    password: credentials.password,
  })

  return request('/auth/login', {
    method: 'POST',
    body,
    skipJsonContentType: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function getCurrentUser() {
  return request('/auth/me')
}

export function getBooks() {
  return fetchAllPages('/books')
}

export function getUsers() {
  return fetchAllPages('/users')
}

export function getLoans() {
  return fetchAllPages('/loans')
}

export function createBook(payload) {
  return request('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateBook(id, payload) {
  return request(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteBook(id) {
  return request(`/books/${id}`, {
    method: 'DELETE',
  })
}

export function createUser(payload) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function createLoan(payload) {
  return request('/loans', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function returnLoan(id, payload = {}) {
  return request(`/loans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
