import { Link } from 'react-router-dom'

const Unauthorized = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
    <h1 className="font-display text-3xl font-semibold">Not authorized</h1>
    <p className="max-w-sm text-text-muted">
      Your account doesn't have access to this page.
    </p>
    <Link to="/login" className="text-rail-applied hover:underline">
      Back to login
    </Link>
  </div>
)

export default Unauthorized
