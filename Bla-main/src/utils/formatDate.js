import { format } from 'date-fns'

export function formatDate(date, withTime) {
  if (withTime) {
    return format(new Date(date * 1000), 'dd MMM yyyy HH:mm')
  }

  return format(new Date(date * 1000), 'dd MMM yyyy')
}
