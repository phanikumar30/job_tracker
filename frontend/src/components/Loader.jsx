const Loader = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-text-muted">
    <span className="h-2 w-2 animate-pulse rounded-full bg-rail-applied" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-rail-interview [animation-delay:150ms]" />
    <span className="h-2 w-2 animate-pulse rounded-full bg-rail-offer [animation-delay:300ms]" />
    <span className="ml-2 text-sm">{label}</span>
  </div>
)

export default Loader
