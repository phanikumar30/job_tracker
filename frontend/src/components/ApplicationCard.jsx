import { FiEdit2, FiTrash2, FiVideo, FiPhoneCall, FiMapPin } from 'react-icons/fi'
import StatusRail from './StatusRail'
import { formatDate } from '../utils/dateUtils'

const MODE_ICON = {
  Online: FiVideo,
  Telephonic: FiPhoneCall,
  'In-person': FiMapPin,
}

const ApplicationCard = ({ application, onEdit, onDelete, readOnly = false }) => {
  const { company, role, status, mode, appliedDate, response, notes } = application
  const ModeIcon = MODE_ICON[mode]

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card transition hover:border-rail-applied/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-text-primary">
            {company}
          </h3>
          <p className="text-sm text-text-muted">{role}</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(application)}
              className="rounded-lg p-2 text-text-muted transition hover:bg-surfaceRaised hover:text-text-primary"
              aria-label="Edit application"
            >
              <FiEdit2 size={15} />
            </button>
            <button
              onClick={() => onDelete(application._id)}
              className="rounded-lg p-2 text-text-muted transition hover:bg-rail-rejected/10 hover:text-rail-rejected"
              aria-label="Delete application"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <StatusRail status={status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-text-muted">
        <span className="font-mono">{formatDate(appliedDate)}</span>
        {mode && (
          <span className="flex items-center gap-1.5">
            {ModeIcon && <ModeIcon size={13} />}
            {mode}
          </span>
        )}
        {response && <span>Response: {response}</span>}
      </div>

      {notes && <p className="mt-3 text-sm text-text-muted">{notes}</p>}
    </div>
  )
}

export default ApplicationCard
