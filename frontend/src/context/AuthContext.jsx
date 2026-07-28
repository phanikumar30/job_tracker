import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../api/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session on refresh - this is why we don't just keep user in memory.
  // Without this, hitting F5 would log everyone out.
  useEffect(() => {
    const storedUser = localStorage.getItem('jt_user')
    const token = localStorage.getItem('jt_token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async ({ email, password, role }) => {
    const { token, user: loggedInUser } = await loginUser({ email, password, role })
    localStorage.setItem('jt_token', token)
    localStorage.setItem('jt_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async ({ name, email, password, role }) => {
    const { token, user: newUser } = await registerUser({ name, email, password, role })
    localStorage.setItem('jt_token', token)
    localStorage.setItem('jt_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('jt_token')
    localStorage.removeItem('jt_user')
    setUser(null)
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook so components do `const { user } = useAuth()` instead of
// importing useContext + AuthContext everywhere. Small thing, but it's
// the convention you'll see in every serious React codebase.
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
