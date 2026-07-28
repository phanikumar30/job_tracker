import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
    <h1 className="font-display text-3xl font-semibold">404</h1>
    <p className="text-text-muted">This page doesn't exist.</p>
    <Link to="/login" className="text-rail-applied hover:underline">
      Back to login
    </Link>
  </div>
)

export default NotFound
