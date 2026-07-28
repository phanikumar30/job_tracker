import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

/**
 * Verifies the JWT on every protected request and attaches the real
 * user document to req.user. Controllers then trust req.user, NEVER
 * anything the client puts in the request body (like a "role" or
 * "studentId" field) - the token is the only source of truth for identity.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      res.status(401)
      throw new Error('Not authorized, user no longer exists')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized, token invalid or expired')
  }
})

/**
 * Usage: router.get('/admin/students', protect, requireRole('admin'), handler)
 * Always used AFTER `protect`, so req.user is guaranteed to exist by the
 * time this runs.
 */
export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403)
    throw new Error('Forbidden - insufficient permissions')
  }
  next()
}
