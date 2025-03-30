import { parse } from 'date-fns/parse'
import { CalendarEvent } from '../types/calendar-event'

const EVENT_REGEXP = new RegExp(`
  (-\\s\[.\]\\s)?

  (?<start>\\w{3}\\s\\d{1,2})

  (\\s-\\s(?<end>\\w{3}\\s\\d{1,2}))?

  :\\s(?<title>.*)
`.replace(/\s/g, ''), 'gm')

export const parseCalendar = (text: string, filename = '') => {
  const reference = new Date()

  if (filename.match(/^\d{4}/)) {
    reference.setFullYear(Number.parseInt(filename.slice(0, 4)))
  }

  const re = new RegExp(EVENT_REGEXP)
  let match

  const events: CalendarEvent[] = []

  while ((match = re.exec(text)) !== null) {
    if (!match.groups) continue

    events.push({
      start: parse(match.groups.start, 'MMM d', reference),
      end: match.groups.end ? parse(match.groups.end, 'MMM d', reference) : null,
      title: match.groups.title,
    })
  }

  return events
}
