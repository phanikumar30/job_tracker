import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { STATUS, INTERVIEW_MODES } from '../utils/constants'
import { todayISO } from '../utils/dateUtils'

const emptyForm = {
  company: '',
  role: '',
  status: STATUS.APPLIED,
  mode: 'Not Scheduled',
  appliedDate: todayISO(),
  response: '',
  notes: '',
}

const ApplicationForm = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState(initialData || emptyForm)
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {initialData ? 'Edit application' : 'Add application'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Company</label>
            <input
              required
              value={form.company}
              onChange={handleChange('company')}
              className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Role</label>
            <input
              required
              value={form.role}
              onChange={handleChange('role')}
              className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Status</label>
              <select
                value={form.status}
                onChange={handleChange('status')}
                className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
              >
                {Object.values(STATUS).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">Interview mode</label>
              <select
                value={form.mode}
                onChange={handleChange('mode')}
                className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
              >
                {INTERVIEW_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Applied date</label>
            <input
              type="date"
              required
              value={form.appliedDate?.slice(0, 10)}
              onChange={handleChange('appliedDate')}
              className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              Response (optional)
            </label>
            <input
              value={form.response}
              onChange={handleChange('response')}
              placeholder="e.g. Awaiting HR round"
              className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={2}
              className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm focus:border-rail-applied"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-lg bg-rail-applied py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : initialData ? 'Save changes' : 'Add application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplicationForm
