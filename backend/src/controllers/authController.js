import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @route  POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email and password are all required')
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    res.status(409)
    throw new Error('An account with this email already exists')
  }

  // Security decision: this endpoint is PUBLIC, so it must never trust a
  // "role" field from the request body. If it did, anyone could POST
  // { role: "admin" } and grant themselves admin access. Every account
  // created here is forced to "student" - see README for how admin
  // accounts get created instead.
  const user = await User.create({ name, email, password, role: 'student' })

  res.status(201).json({
    token: generateToken(user._id),
    user,
  })
})

// @route  POST /api/auth/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  // .select('+password') because the schema excludes it by default
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    // Deliberately the same message for "no such user" and "wrong password" -
    // telling an attacker which one it was makes account enumeration easier.
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // The frontend's role toggle (Student/Admin tab) is a UX nicety, not a
  // security boundary - the JWT + DB role is what actually gates access.
  // This check just gives a clearer error if someone picks the wrong tab.
  if (role && user.role !== role) {
    res.status(401)
    throw new Error(`This account is not registered as ${role}`)
  }

  res.json({
    token: generateToken(user._id),
    user,
  })
})

// @route  GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  // req.user was already fetched fresh from the DB by the `protect`
  // middleware, so we can just return it.
  res.json({ user: req.user })
})
