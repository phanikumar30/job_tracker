import { STATUS } from '../utils/constants'

/**
 * Controlled filter bar - the parent owns the filter state and passes it
 * down, this component only renders inputs and calls onChange.
 * This keeps filtering logic in one place (the page/hook that fetches data)
 * instead of scattering state across components.
 */
const FilterBar = ({ filters, onChange, onReset }) => {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <input
        type="text"
        placeholder="Company"
        value={filters.company || ''}
        onChange={handle('company')}
        className="w-36 rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary placeholder:text-text-faint focus:border-rail-applied"
      />
      <input
        type="text"
        placeholder="Role"
        value={filters.role || ''}
        onChange={handle('role')}
        className="w-36 rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary placeholder:text-text-faint focus:border-rail-applied"
      />
      <select
        value={filters.status || ''}
        onChange={handle('status')}
        className="rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary focus:border-rail-applied"
      >
        <option value="">All statuses</option>
        {Object.values(STATUS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <label className="text-xs text-text-muted">From</label>
        <input
          type="date"
          value={filters.from || ''}
          onChange={handle('from')}
          className="rounded-lg border border-border bg-ink px-2 py-2 text-sm text-text-primary focus:border-rail-applied"
        />
        <label className="text-xs text-text-muted">To</label>
        <input
          type="date"
          value={filters.to || ''}
          onChange={handle('to')}
          className="rounded-lg border border-border bg-ink px-2 py-2 text-sm text-text-primary focus:border-rail-applied"
        />
      </div>
      <button
        onClick={onReset}
        className="ml-auto rounded-lg px-3 py-2 text-sm text-text-muted transition hover:text-text-primary"
      >
        Clear filters
      </button>
    </div>
  )
}

export default FilterBar
