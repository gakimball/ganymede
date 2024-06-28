import { memo } from 'preact/compat';
import s from './markdown-overlay.module.css'

const HEADING_REGEX = /^#{1,6}/
const LINE_REGEX = /^(-|\*|\d+?\.)(.*)/
const TASK_REGEX = /^(- \[( |x)\])(.*)/
const STRIKETHRU_REGEX = /~~(.*?)~~/g

interface MarkdownOverlayProps {
  value: string;
}

const replaceStrikethru = (substr: string) => `<span class="${s.complete}">${substr}</span>`
const parseInlineStyle = (line: string) => {
  return line.replace(STRIKETHRU_REGEX, replaceStrikethru)
}

export const MarkdownOverlay = memo<MarkdownOverlayProps>(({
  value,
}) => {
  let html = ''

  value.split('\n').forEach(line => {
    let match

    if ((match = line.match(TASK_REGEX)) !== null) {
      const isComplete = line.startsWith('- [x]')
      html += `<span class="${s.bullet} ${isComplete ? s.complete : ''}">${match[1]}</span>`
      html += `<span class="${isComplete ? s.complete : ''}">${match[3]}</span><br>`
    } else if ((match = line.match(LINE_REGEX)) !== null) {
      html += `<span class="${s.bullet}">${match[1]}</span>${parseInlineStyle(match[2])}<br>`
    } else if (HEADING_REGEX.test(line)) {
      html += `<span class="${s.heading}">${line}</span><br>`
    } else {
      html += `${parseInlineStyle(line)}<br>`
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
