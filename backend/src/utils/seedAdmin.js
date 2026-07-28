import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

/**
 * Run once with: npm run seed:admin
 *
 * Why this exists as a separate script instead of a public "become admin"
 * endpoint: if /api/auth/register let you set your own role, anyone could
 * grant themselves admin access. Real apps create the first admin via a
 * script like this (or directly in the database), and any *additional*
 * admins after that get created by an already-authenticated admin through
 * a protected endpoint - never through open self-service.
 */
const seedAdmin = async () => {
  await connectDB()

  const email = process.env.SEED_ADMIN_EMAIL
  const existing = await User.findOne({ email })

  if (existing) {
    console.log(`Admin already exists: ${email}`)
    process.exit(0)
  }

  await User.create({
    name: process.env.SEED_ADMIN_NAME || 'Admin',
    email,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin',
  })

  console.log(`Admin created: ${email}`)
  console.log('Log in with this account, then change the password immediately.')
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
