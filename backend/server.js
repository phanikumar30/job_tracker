import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'

import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import applicationRoutes from './src/routes/applicationRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
import { notFound, errorHandler } from './src/middleware/errorHandler.js'

dotenv.config()
connectDB()

const app = express()

// --- Security & parsing middleware, in order ---
app.use(helmet()) // sensible security headers
// app.use(
//   cors({
//     origin: (process.env.CLIENT_ORIGIN || 'https://jobs-trackr.netlify.app/login').split(','),
//     credentials: true,
//   }),
// )

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' })) // small limit - this API doesn't need large payloads
app.use(mongoSanitize()) // strips $ and . from req.body/query to block NoSQL injection

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// --- Routes ---
app.get("/", (req, res) =>{
  res.send("Server running correctly....!")
})
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/admin', adminRoutes)

// --- Error handling - must be registered last ---
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
