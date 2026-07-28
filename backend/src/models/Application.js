import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    // This is the field that makes ownership enforceable at the query level.
    // Every read/update/delete filters by { student: req.user._id }, so a
    // student can never fetch or modify another student's row just by
    // guessing an _id.
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    mode: {
      type: String,
      enum: ['Online', 'In-person', 'Telephonic', 'Not Scheduled'],
      default: 'Not Scheduled',
    },
    appliedDate: { type: Date, required: true },
    response: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
)

// Compound index - almost every query here is "this student's rows,
// newest first", so this is the index that actually gets used in production.
applicationSchema.index({ student: 1, appliedDate: -1 })

export default mongoose.model('Application', applicationSchema)
