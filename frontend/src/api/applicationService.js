import api from './axiosInstance'

// Backend contract this expects:
// GET    /api/applications                 ?company=&role=&status=&from=&to=   -> student's own applications, filtered
// POST   /api/applications                 { company, role, status, mode, appliedDate, notes }
// PUT    /api/applications/:id             partial update (e.g. status change)
// DELETE /api/applications/:id
//
// GET    /api/admin/students                                                    -> list of students + application counts
// GET    /api/admin/students/:studentId/applications  ?company=&role=&status=    -> one student's applications (admin view)

export const getMyApplications = async (filters = {}) => {
  const { data } = await api.get('/applications', { params: filters })
  return data
}

export const createApplication = async (payload) => {
  const { data } = await api.post('/applications', payload)
  return data
}

export const updateApplication = async (id, payload) => {
  const { data } = await api.put(`/applications/${id}`, payload)
  return data
}

export const deleteApplication = async (id) => {
  const { data } = await api.delete(`/applications/${id}`)
  return data
}

export const getAllStudentsOverview = async () => {
  const { data } = await api.get('/admin/students')
  return data
}

export const getStudentApplications = async (studentId, filters = {}) => {
  const { data } = await api.get(`/admin/students/${studentId}/applications`, {
    params: filters,
  })
  return data
}
