import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: ROLES.STUDENT })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name}`)
      navigate(user.role === ROLES.ADMIN ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rail-offer" />
          <h1 className="font-display text-xl font-semibold">Trackr</h1>
        </div>
        <p className="mb-6 text-sm text-text-muted">
          Sign in to track your job applications.
        </p>

        <div className="mb-4 flex rounded-lg border border-border p-1">
          {[ROLES.STUDENT, ROLES.ADMIN].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 rounded-md py-1.5 text-sm capitalize transition ${
                form.role === r
                  ? 'bg-rail-applied text-white'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rail-applied py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-muted">
          New student?{' '}
          <Link to="/register" className="text-rail-applied hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
