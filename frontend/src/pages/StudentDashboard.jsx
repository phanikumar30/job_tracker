import { useCallback, useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import ApplicationCard from '../components/ApplicationCard'
import ApplicationForm from '../components/ApplicationForm'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import {
  getMyApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../api/applicationService'
import { STATUS } from '../utils/constants'

const StudentDashboard = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)

  // Debounce-free but centralized fetch - every filter change re-fetches
  // from the server rather than filtering an in-memory array, so it stays
  // correct even as the dataset grows past what you'd want to load at once.
  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyApplications(filters)
      setApplications(data)
    } catch (err) {
      toast.error('Could not load applications')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleCreateOrUpdate = async (formData) => {
    if (editingApp) {
      const updated = await updateApplication(editingApp._id, formData)
      setApplications((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      )
      toast.success('Application updated')
    } else {
      const created = await createApplication(formData)
      setApplications((prev) => [created, ...prev])
      toast.success('Application added')
    }
    setEditingApp(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    await deleteApplication(id)
    setApplications((prev) => prev.filter((a) => a._id !== id))
    toast.success('Application removed')
  }

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === STATUS.INTERVIEW).length,
    offer: applications.filter((a) => a.status === STATUS.OFFER).length,
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">My applications</h2>
            <p className="text-sm text-text-muted">
              {stats.total} total · {stats.interview} in interview · {stats.offer} offers
            </p>
          </div>
          <button
            onClick={() => {
              setEditingApp(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-rail-applied px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <FiPlus size={16} />
            Add application
          </button>
        </div>

        <div className="mb-6">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>

        {loading ? (
          <Loader label="Loading applications…" />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            subtitle="Start tracking your job search by adding your first application."
            actionLabel="Add application"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={(a) => {
                  setEditingApp(a)
                  setShowForm(true)
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ApplicationForm
          initialData={editingApp}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false)
            setEditingApp(null)
          }}
        />
      )}
    </div>
  )
}

export default StudentDashboard
