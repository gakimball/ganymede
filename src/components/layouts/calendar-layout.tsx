import { memo, useEffect, useMemo, useState } from 'preact/compat';
import { CalendarFile } from '../../state/file-store';
import { TabGroup } from '../common/tab-group';
import { Tab } from '../common/tab';
import { TextEditor } from '../common/text-editor';
import { Calendar, CalendarPeriod } from '../common/calendar';
import { parseCalendar } from '../../utils/parse-calendar';
import { Button } from '../common/button';
import { useEventHandler } from '../../hooks/use-event-handler';
import { Icon } from '../common/icon';
import { format } from 'date-fns/format';
import { useStore } from '../../state/use-store';

export const CalendarLayout = memo<CalendarFile>(({
  file,
  contents,
}) => {
  const { files } = useStore()

  const [mode, setMode] = useState<'calendar' | 'text'>('calendar')
  const [period, setPeriod] = useState<CalendarPeriod>(() => {
    const now = new Date()

    return {
      month: now.getMonth(),
      year: now.getFullYear(),
    }
  })

  const events = useMemo(() => {
    return parseCalendar(contents, file.name)
  }, [contents, file.name])
  const periodText = useMemo(() => {
    return format(
      new Date(period.year, period.month, 1),
      'MMM yyyy',
    )
  }, [period])

  const nextPeriod = useEventHandler(() => {
    setPeriod(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  })

  const prevPeriod = useEventHandler(() => {
    setPeriod(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  })

  useEffect(() => {
    if (mode === 'calendar') {
      files.openFile(file)
    }
  }, [mode])

  console.log({ events })

  return (
    <>
      <div className="pt-3 px-4">
        <TabGroup>
          <Tab
            isActive={mode === 'calendar'}
            onClick={() => setMode('calendar')}
          >
            Calendar
          </Tab>
          <Tab
            isActive={mode === 'text'}
            onClick={() => setMode('text')}
          >
            Text
          </Tab>
          <div
            data-hide={mode !== 'calendar'}
            className="flex gap-2 ms-auto var-[hide]:opacity-0"
          >
            <Button onClick={prevPeriod} size="small">
              <div className="relative top-1">
                <Icon name="arrow-left" />
              </div>
            </Button>
            <Button isDisabled size="small">
              {periodText}
            </Button>
            <Button onClick={nextPeriod} size="small">
              <div className="relative top-1">
                <Icon name="arrow-right" />
              </div>
            </Button>
          </div>
        </TabGroup>
      </div>
      {mode === 'calendar' && (
        <div className="px-4 mt-5">
          <Calendar
            events={events}
            period={period}
          />
        </div>
      )}
      {mode === 'text' && (
        <TextEditor
          key={file.path}
          file={file}
          contents={contents}
        />
      )}
    </>
  )
})
