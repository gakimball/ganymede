import { XIT_TASK_REGEX } from './constants'
import { countXitTasks } from './count-xit-tasks'

const hl = {
  red: 'text-syntax-red',
  orange: 'text-syntax-orange',
  yellow: 'text-syntax-yellow',
  green: 'text-syntax-green',
  blue: 'text-syntax-blue',
  purple: 'text-syntax-purple',
  pink: 'text-syntax-pink',
  gray: 'text-syntax-gray',
}

const MD_HEADING_REGEX = /^#{1,6}/
const MD_LINE_REGEX = /^(-|\*|\d+?\.) (.*)/
const MD_TASK_REGEX = /^(- \[( |x)\])(.*)/
const MD_STRIKETHRU_REGEX = /~~(.*?)~~/g

const GMI_HEADING_REGEX = /^#{1,3}/
const GMI_LINK_REGEX = /^=> (\S+)( .*)?/

const XIT_STATUS_COLORS: {
  [k: string]: string;
} = {
  ' ': hl.blue,
  '@': hl.pink,
  'x': hl.green,
  '~': hl.gray,
  '?': hl.yellow,
}

const REC_FIELD_REGEX = /^([a-zA-Z%][a-zA-Z0-9_]*:)(.*)/

const escape = (text: string) => text.replace(/</g, '&lt;').replace(/>/, '&gt;')
const replaceStrikethru = (substr: string) => `<span class="${hl.gray}">${substr}</span>`
const parseInlineStyle = (line: string) => {
  return escape(line).replace(MD_STRIKETHRU_REGEX, replaceStrikethru)
}

export const syntaxHighlighters = {
  markdown: (text: string) => {
    let html = ''

    text.split('\n').forEach(line => {
      let match

      if ((match = line.match(MD_TASK_REGEX)) !== null) {
        const isComplete = line.startsWith('- [x]')
        html += `<span class="${isComplete ? hl.gray : hl.blue}">${escape(match[1])}</span>`
        html += `<span class="${isComplete ? hl.gray : ''}">${escape(match[3])}</span><br>`
      } else if ((match = line.match(MD_LINE_REGEX)) !== null) {
        html += `<span class="${hl.blue}">${match[1]}</span> ${parseInlineStyle(match[2])}<br>`
      } else if (MD_HEADING_REGEX.test(line)) {
        html += `<span class="${hl.red}">${escape(line)}</span><br>`
      } else {
        html += `${parseInlineStyle(line)}<br>`
      }
    })

    return html
  },

  gemtext: (text: string) => {
    let html = ''

    text.split('\n').forEach(line => {
      let match

      if ((match = line.match(GMI_HEADING_REGEX)) !== null) {
        html += `<span class="${hl.red}">${escape(line)}</span>`
      } else if (line.startsWith('-')) {
        html += `<span class="${hl.blue}">-</span>${escape(line.slice(1))}`
      } else if ((match = line.match(GMI_LINK_REGEX)) !== null) {
        html += `<span class="${hl.blue}">=> <a href="${match[1]}" class="underline">${escape(match[1])}</a></span>`
        html += escape(match[2] ?? '')
      } else {
        html += escape(line)
      }

      html += '<br>'
    })

    return html
  },

  xit: (text: string) => {
    let html = ''

    const tasks = countXitTasks(text)

    html += `<span class="absolute top-3 right-4">`
    html += `<span class="${XIT_STATUS_COLORS['x']}">[x]</span> ${tasks.complete}/${tasks.total}`
    if (tasks.pending) html += `<span class="${XIT_STATUS_COLORS['@']}"> [@]</span> ${tasks.pending}`
    if (tasks.question) html += `<span class="${XIT_STATUS_COLORS['?']}"> [?]</span> ${tasks.question}`
    html += `</span>`

    text.split('\n').forEach((line) => {
      const match = XIT_TASK_REGEX.exec(line)

      if (match?.groups?.status) {
        const status = match.groups.status
        const statusColor = XIT_STATUS_COLORS[status]
        const isResolved = ['x', '~'].includes(status)

        html += `<span class="${statusColor}">${line.slice(0, 3)}</span>`
        html += `<span class="${isResolved ? hl.gray : 'text-content-secondary'}">${escape(line.slice(3))}</span><br>`
      } else if (line.trim() !== '') {
        html += `<span class="underline">${escape(line)}</span><br>`
      } else {
        html += `${escape(line)}<br />`
      }
    })

    return html
  },

  rec: (text: string) => {
    let html = ''

    text.split('\n').forEach(line => {
      let match

      if (line.startsWith('#')) {
        html += `<span class="${hl.gray}">${escape(line)}</span>`
      } else if (line.startsWith('+')) {
        html += `<span class="${hl.orange}">+</span>${escape(line.slice(1))}`
      } else if ((match = line.match(REC_FIELD_REGEX)) !== null) {
        html += `<span class="${line.startsWith('%') ? hl.blue : hl.red}">${escape(match[1])}</span>${escape(match[2])}`
      } else {
        html += escape(line)
      }

      html += '<br>'
    })

    return html
  },

  plaintext: (text: string) => text,
}
