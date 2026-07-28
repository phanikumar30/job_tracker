export const STATUS = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
}

export const STATUS_ORDER = [STATUS.APPLIED, STATUS.INTERVIEW, STATUS.OFFER]

export const STATUS_COLOR = {
  [STATUS.APPLIED]: 'rail-applied',
  [STATUS.INTERVIEW]: 'rail-interview',
  [STATUS.OFFER]: 'rail-offer',
  [STATUS.REJECTED]: 'rail-rejected',
}

export const INTERVIEW_MODES = ['Online', 'In-person', 'Telephonic', 'Not Scheduled']

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
}
