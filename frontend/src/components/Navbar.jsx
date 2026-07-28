import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-rail-offer" />
        <h1 className="font-display text-lg font-semibold tracking-tight">Trackr</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">{user?.name}</p>
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            {user?.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:border-rail-rejected/50 hover:text-rail-rejected"
        >
          <FiLogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
