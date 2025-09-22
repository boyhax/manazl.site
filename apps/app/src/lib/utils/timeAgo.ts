import { formatDistanceToNow } from 'date-fns'

export function timeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}
