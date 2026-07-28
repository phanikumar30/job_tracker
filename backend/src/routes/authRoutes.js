import express from 'express'
import { registerUser, loginUser, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiters.js'

const router = express.Router()

// Rate-limited because auth endpoints are the #1 target for brute-force
// and credential-stuffing bots - everything else in the API doesn't need it.
router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)
router.get('/me', protect, getMe)

export default router
