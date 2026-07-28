import rateLimit from 'express-rate-limit'

// 20 attempts per 15 minutes per IP on login/register - generous enough for
// a real user who mistypes their password a few times, tight enough to
// slow down a brute-force script.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
})
