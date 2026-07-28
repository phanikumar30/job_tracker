import axios from 'axios'

/**
 * Why a single instance instead of calling axios.get(...) everywhere:
 * 1. One place to attach the JWT token to every request.
 * 2. One place to catch "token expired" (401) and force logout.
 * 3. One place to change the base URL when you deploy (Vercel/Render/etc).
 *
 * This is the pattern you'll see in almost every real MERN codebase -
 * a services/api layer that components never bypass.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token on every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401 so the app never sits in a broken "half logged in" state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jt_token')
      localStorage.removeItem('jt_user')
      // Full reload clears any in-memory state that might reference the old user
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
