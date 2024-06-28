import { memo } from 'preact/compat';
import s from './markdown-overlay.module.css'

const HEADING_REGEX = /^#{1,6}/
const LINE_REGEX = /^(-|\*|\d+?\.)/

interface MarkdownOverlayProps {
  value: string;
}

export const MarkdownOverlay = memo<MarkdownOverlayProps>(({
  value,
}) => {
  let html = ''

  value.split('\n').forEach(line => {
    if (LINE_REGEX.test(line)) {
      html += `<span class="${s.bullet}">${line}</span><br>`
    } else if (HEADING_REGEX.test(line)) {
      html += `<span class="${s.heading}">${line}</span><br>`
    } else {
      html += `${line}<br>`
    }
  })

  return (
    <div
      className="font-monospace"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
})
