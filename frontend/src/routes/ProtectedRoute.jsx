import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Usage:
 *   <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
 *
 * This is the standard "gatekeeper" pattern - instead of checking
 * `if (!user) return null` inside every page component, the routing
 * layer decides who's allowed in before the page ever renders.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return null // could render a spinner here

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
