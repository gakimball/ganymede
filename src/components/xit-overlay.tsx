import s from './xit-overlay.module.css'
import { memo } from 'preact/compat';

const TASK_LINE_REGEX = /^\[(?<status> |x|@|~|\?)\]/
const statuses: {
  [k: string]: string;
} = {
  ' ': 'open',
  '@': 'ongoing',
  'x': 'checked',
  '~': 'obsolete',
  '?': 'in-question'
}

interface XitOverlayProps {
  value: string;
}

export const XitOverlay = memo<XitOverlayProps>(({
  value,
}) => {
  let html = ''

  value.split('\n').forEach((line, index) => {
    const match = TASK_LINE_REGEX.exec(line)

    if (match?.groups?.status) {
      const status = statuses[match.groups.status]
      const isResolved = ['checked', 'obsolete'].includes(status)

      html += `<span class="${s[`checkbox-status-${status}`]}">${line.slice(0, 3)}</span>`
      html += `<span class="${isResolved ? s['text-resolved'] : 'text-body-secondary'}">${line.slice(3)}</span><br>`
    } else if (line.trim() !== '') {
      html += `<span class="${s['text-title']}">${line}</span><br>`
    } else {
      html += `${line}<br />`
    }
  })

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
})
