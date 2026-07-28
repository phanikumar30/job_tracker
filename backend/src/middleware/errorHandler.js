/**
 * Catches: (a) requests to routes that don't exist, and (b) errors thrown/
 * passed via next(err) anywhere in the app (asyncHandler forwards them here
 * automatically). One place decides the response shape for every error -
 * the frontend can always expect { message } back.
 */

export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found - ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    message: err.message || 'Server error',
    // Stack traces are useful in dev, but leaking them in production tells
    // an attacker your file structure and dependency versions - never do it.
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
