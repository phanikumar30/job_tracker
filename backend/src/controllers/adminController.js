import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Application from '../models/Application.js'
import { buildFilter } from './applicationController.js'

// @route  GET /api/admin/students
// @access Private (admin only)
export const getAllStudentsOverview = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('name email createdAt')

  // Aggregation instead of N+1 queries (one query per student) - this is
  // the difference between a dashboard that's fine with 10 students and one
  // that's still fine with 10,000.
  const counts = await Application.aggregate([
    {
      $group: {
        _id: '$student',
        applicationCount: { $sum: 1 },
        offerCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Offer'] }, 1, 0] },
        },
      },
    },
  ])

  const countMap = new Map(counts.map((c) => [c._id.toString(), c]))

  const result = students.map((s) => {
    const c = countMap.get(s._id.toString())
    return {
      _id: s._id,
      name: s.name,
      email: s.email,
      applicationCount: c?.applicationCount || 0,
      offerCount: c?.offerCount || 0,
    }
  })

  res.json(result)
})

// @route  GET /api/admin/students/:studentId/applications
// @access Private (admin only)
export const getStudentApplications = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.studentId, role: 'student' })

  if (!student) {
    res.status(404)
    throw new Error('Student not found')
  }

  const filter = buildFilter({ student: student._id }, req.query)
  const applications = await Application.find(filter).sort({ appliedDate: -1 })

  res.json({
    student: { _id: student._id, name: student.name, email: student.email },
    applications,
  })
})
