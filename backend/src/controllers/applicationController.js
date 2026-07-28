import asyncHandler from 'express-async-handler'
import Application from '../models/Application.js'

// Builds the Mongo filter object from query params shared by student and
// admin routes, so both can reuse identical filtering logic.
const buildFilter = (baseFilter, query) => {
  const filter = { ...baseFilter }

  if (query.company) {
    filter.company = { $regex: query.company, $options: 'i' }
  }
  if (query.role) {
    filter.role = { $regex: query.role, $options: 'i' }
  }
  if (query.status) {
    filter.status = query.status
  }
  if (query.from || query.to) {
    filter.appliedDate = {}
    if (query.from) filter.appliedDate.$gte = new Date(query.from)
    if (query.to) filter.appliedDate.$lte = new Date(query.to)
  }

  return filter
}

// @route  GET /api/applications
// @access Private (student)
export const getMyApplications = asyncHandler(async (req, res) => {
  const filter = buildFilter({ student: req.user._id }, req.query)
  const applications = await Application.find(filter).sort({ appliedDate: -1 })
  res.json(applications)
})

// @route  POST /api/applications
// @access Private (student)
export const createApplication = asyncHandler(async (req, res) => {
  const { company, role, status, mode, appliedDate, response, notes } = req.body

  if (!company || !role || !appliedDate) {
    res.status(400)
    throw new Error('Company, role and applied date are required')
  }

  const application = await Application.create({
    student: req.user._id, // always from the token, never from req.body
    company,
    role,
    status,
    mode,
    appliedDate,
    response,
    notes,
  })

  res.status(201).json(application)
})

// @route  PUT /api/applications/:id
// @access Private (student, own record only)
export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)

  if (!application) {
    res.status(404)
    throw new Error('Application not found')
  }

  // Ownership check - this is the line that stops student A from editing
  // student B's row just by knowing/guessing the _id.
  if (application.student.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('You do not have permission to modify this application')
  }

  const allowedFields = ['company', 'role', 'status', 'mode', 'appliedDate', 'response', 'notes']
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) application[field] = req.body[field]
  })

  const updated = await application.save()
  res.json(updated)
})

// @route  DELETE /api/applications/:id
// @access Private (student, own record only)
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)

  if (!application) {
    res.status(404)
    throw new Error('Application not found')
  }

  if (application.student.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('You do not have permission to delete this application')
  }

  await application.deleteOne()
  res.json({ message: 'Application deleted', id: req.params.id })
})

export { buildFilter }
