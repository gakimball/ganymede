import { parse } from 'date-fns/parse'
import { CalendarEvent } from '../types/calendar-event'

const EVENT_REGEXP = new RegExp(`
  ^

  (-\s\[.\]\s)?

  (?<start>\\d{4}-\\d{2}-\\d{2})

  (\\s/\\s(?<end>\\d{4}-\\d{2}-\\d{2}))?

  :\\s(?<title>.*)

  $
`.replace(/\s/g, ''), 'gm')

export const parseCalendar = (text: string) => {
  const re = new RegExp(EVENT_REGEXP)
  let match
  const reference = new Date()

  const events: CalendarEvent[] = []

  while ((match = re.exec(text)) !== null) {
    if (!match.groups) continue

    events.push({
      start: parse(match.groups.start, 'yyyy-MM-dd', reference),
      end: match.groups.end ? parse(match.groups.end, 'yyyy-MM-dd', reference) : null,
      title: match.groups.title,
    })
  }

  return events
}
