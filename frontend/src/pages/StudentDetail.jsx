import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import ApplicationCard from '../components/ApplicationCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { getStudentApplications } from '../api/applicationService'

const StudentDetail = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getStudentApplications(studentId, filters)
      // Expecting backend to return { student: { name }, applications: [...] }
      setApplications(data.applications || data)
      if (data.student) setStudentName(data.student.name)
    } catch {
      toast.error('Could not load this student\'s applications')
    } finally {
      setLoading(false)
    }
  }, [studentId, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <button
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"
        >
          <FiArrowLeft size={14} />
          Back to students
        </button>

        <h2 className="mb-1 font-display text-2xl font-semibold">
          {studentName || 'Student'} — applications
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          Read-only view. Admins can review but not edit a student's entries.
        </p>

        <div className="mb-6">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>

        {loading ? (
          <Loader label="Loading…" />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications match these filters"
            subtitle="Try clearing filters or check back once this student logs applications."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {applications.map((app) => (
              <ApplicationCard key={app._id} application={app} readOnly />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDetail
