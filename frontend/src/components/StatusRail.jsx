import { STATUS, STATUS_ORDER } from '../utils/constants'

/**
 * Visual signature of the app: applications don't just get a colored badge,
 * they get a little horizontal "track" showing where they sit in the
 * pipeline (Applied -> Interview -> Offer), because this is literally
 * a job *tracker*. Rejected breaks off the track entirely, in red.
 */
const StatusRail = ({ status }) => {
  const isRejected = status === STATUS.REJECTED
  const currentIndex = STATUS_ORDER.indexOf(status)

  if (isRejected) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-rail-rejected" />
        <span className="font-mono text-xs uppercase tracking-wide text-rail-rejected">
          Rejected
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5" title={status}>
      {STATUS_ORDER.map((step, i) => {
        const reached = i <= currentIndex
        const isLast = i === STATUS_ORDER.length - 1
        return (
          <div key={step} className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                reached ? 'bg-rail-offer' : 'bg-border'
              }`}
            />
            {!isLast && (
              <span
                className={`h-[2px] w-5 rounded ${
                  i < currentIndex ? 'bg-rail-offer' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
      <span className="ml-1.5 font-mono text-xs uppercase tracking-wide text-text-muted">
        {status}
      </span>
    </div>
  )
}

export default StatusRail
