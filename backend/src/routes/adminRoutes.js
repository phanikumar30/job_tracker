import express from 'express'
import {
  getAllStudentsOverview,
  getStudentApplications,
} from '../controllers/adminController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, requireRole('admin'))

router.get('/students', getAllStudentsOverview)
router.get('/students/:studentId/applications', getStudentApplications)

export default router
