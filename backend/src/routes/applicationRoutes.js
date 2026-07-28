import express from 'express'
import {
  getMyApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Every route here requires a valid token AND the student role -
// admins use a completely separate set of read-only routes (adminRoutes.js)
// instead of reusing these, so the two access patterns never get tangled.
router.use(protect, requireRole('student'))

router.get('/', getMyApplications)
router.post('/', createApplication)
router.put('/:id', updateApplication)
router.delete('/:id', deleteApplication)

export default router
