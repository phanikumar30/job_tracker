import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiChevronRight, FiSearch } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { getAllStudentsOverview } from '../api/applicationService'

const AdminDashboard = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllStudentsOverview()
        setStudents(data)
      } catch {
        toast.error('Could not load students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Students</h2>
            <p className="text-sm text-text-muted">
              {students.length} students · click a row to view their applications
            </p>
          </div>
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
              size={15}
            />
            <input
              placeholder="Search students…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:border-rail-applied"
            />
          </div>
        </div>

        {loading ? (
          <Loader label="Loading students…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No students found"
            subtitle="Once students register and start applying, they'll show up here."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Applications</th>
                  <th className="px-4 py-3 font-medium">Offers</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    onClick={() => navigate(`/admin/students/${s._id}`)}
                    className="cursor-pointer border-b border-border last:border-0 transition hover:bg-surfaceRaised"
                  >
                    <td className="px-4 py-3 font-medium text-text-primary">{s.name}</td>
                    <td className="px-4 py-3 text-text-muted">{s.email}</td>
                    <td className="px-4 py-3 font-mono">{s.applicationCount}</td>
                    <td className="px-4 py-3 font-mono text-rail-offer">
                      {s.offerCount}
                    </td>
                    <td className="px-4 py-3 text-text-faint">
                      <FiChevronRight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
