/**
 * An empty screen is an invitation to act, not a dead end -
 * so it always carries a next step, not just "no data".
 */
const EmptyState = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
    <p className="font-display text-base font-medium text-text-primary">{title}</p>
    {subtitle && <p className="max-w-sm text-sm text-text-muted">{subtitle}</p>}
    {actionLabel && (
      <button
        onClick={onAction}
        className="mt-2 rounded-lg bg-rail-applied px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        {actionLabel}
      </button>
    )}
  </div>
)

export default EmptyState
