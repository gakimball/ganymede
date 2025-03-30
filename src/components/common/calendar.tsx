import { endOfMonth } from 'date-fns';
import { addDays } from 'date-fns/addDays';
import { constructNow } from 'date-fns/constructNow';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { differenceInDays } from 'date-fns/differenceInDays';
import { endOfWeek } from 'date-fns/endOfWeek';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { FunctionComponent } from 'preact';
import { useMemo, useState } from 'preact/hooks'
import { CalendarEvent } from '../../types/calendar-event';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { format } from 'date-fns/format';
import { isToday } from 'date-fns/isToday';

export interface CalendarPeriod {
  month: number;
  year: number;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

type CalendarEventMap = Record<string, {
  title: string;
  position: 'start' | 'middle' | 'end';
}>

interface CalendarProps {
  events: CalendarEvent[];
  period: CalendarPeriod;
}

export const Calendar: FunctionComponent<CalendarProps> = ({
  events,
  period,
}) => {
  const days = useMemo(() => {
    const date = new Date(period.year, period.month, 1)

    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(date)),
      end: endOfWeek(endOfMonth(date)),
    })
  }, [period])

  const eventMap = useMemo(() => {
    return events.reduce<CalendarEventMap>((acc, event) => {
      eachDayOfInterval({
        start: event.start,
        end: event.end ?? event.start,
      }).forEach((date, index, array) => {
        acc[format(date, 'yyyy-MM-dd')] = {
          title: event.title,
          position: array.length === 1
            ? 'middle'
            : index === 0
            ? 'start'
            : index === array.length - 1
            ? 'end'
            : 'middle',
        }
      })

      return acc
    }, {})
  }, [events])

  const weeks = Math.ceil(days.length / 7)

  return (
    <div className="flex flex-wrap border-1 border-border">
      {DAYS.map((day, index, arr) => (
        <div
          key={day}
          data-is-last-column={index === arr.length - 1}
          className="
            w-[14.285%]
            p-2
            text-sm text-content-secondary
            border-r-1 border-b-1 border-border
            var-[is-last-column]:border-r-0
          "
        >
          {day.slice(0, 3)}
        </div>
      ))}
      {days.map((day, index) => (
        <div
          key={day.toString()}
          data-is-last-column={(index + 1) % 7 === 0}
          data-is-last-row={Math.ceil((index + 1) / 7) === weeks}
          className="
            w-[14.285%] h-20
            p-2
            border-r-1 border-b-1 border-border
            var-[is-last-column]:border-r-0
            var-[is-last-row]:border-b-0
          "
        >
          <p
            data-is-outside-month={day.getMonth() !== period.month}
            data-is-today={isToday(day)}
            className="
              text-sm
              var-[is-outside-month]:text-content-secondary
              var-[is-today]:text-primary
            "
          >
            {day.getDate()}
          </p>
          <p className="text-sm truncate">
            {eventMap[format(day, 'yyyy-MM-dd')]?.title}
          </p>
        </div>
      ))}
    </div>
  )
}
