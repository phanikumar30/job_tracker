import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

/**
 * Note: this form only creates STUDENT accounts.
 * In a real system, admin accounts are never created through a public
 * sign-up form (that would let anyone grant themselves admin access) -
 * admins are seeded directly in the database or created by an existing
 * admin from inside the app. Keep that rule when you build the backend.
 */
const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({ ...form, role: ROLES.STUDENT })
      toast.success('Account created')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <h1 className="mb-1 font-display text-xl font-semibold">Create account</h1>
        <p className="mb-6 text-sm text-text-muted">Student sign-up for Trackr.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rail-applied py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-rail-applied hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
