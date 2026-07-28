import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return ''
  }
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
