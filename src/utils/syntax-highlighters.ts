const hl = {
  red: 'text-syntax-red',
  orange: 'text-syntax-orange',
  yellow: 'text-syntax-yellow',
  green: 'text-syntax-green',
  blue: 'text-syntax-blue',
  indigo: 'text-syntax-indigo',
  violet: 'text-syntax-violet',
  gray: 'text-syntax-gray',
}

const MD_HEADING_REGEX = /^#{1,6}/
const MD_LINE_REGEX = /^(-|\*|\d+?\.)(.*)/
const MD_TASK_REGEX = /^(- \[( |x)\])(.*)/
const MD_STRIKETHRU_REGEX = /~~(.*?)~~/g

const XIT_TASK_REGEX = /^\[(?<status> |x|@|~|\?)\]/
const XIT_STATUS_COLORS: {
  [k: string]: string;
} = {
  ' ': hl.blue,
  '@': hl.violet,
  'x': hl.green,
  '~': hl.gray,
  '?': hl.yellow,
}

const replaceStrikethru = (substr: string) => `<span class="${hl.gray}">${substr}</span>`
const parseInlineStyle = (line: string) => {
  return line.replace(MD_STRIKETHRU_REGEX, replaceStrikethru)
}

export const syntaxHighlighters = {
  markdown: (text: string) => {
    let html = ''

    text.split('\n').forEach(line => {
      let match

      if ((match = line.match(MD_TASK_REGEX)) !== null) {
        const isComplete = line.startsWith('- [x]')
        html += `<span class="${isComplete ? hl.gray : hl.blue}">${match[1]}</span>`
        html += `<span class="${isComplete ? hl.gray : ''}">${match[3]}</span><br>`
      } else if ((match = line.match(MD_LINE_REGEX)) !== null) {
        html += `<span class="${hl.blue}">${match[1]}</span>${parseInlineStyle(match[2])}<br>`
      } else if (MD_HEADING_REGEX.test(line)) {
        html += `<span class="${hl.red}">${line}</span><br>`
      } else {
        html += `${parseInlineStyle(line)}<br>`
      }
    })

    return html
  },

  xit: (text: string) => {
    let html = ''

    text.split('\n').forEach((line) => {
      const match = XIT_TASK_REGEX.exec(line)

      if (match?.groups?.status) {
        const status = match.groups.status
        const statusColor = XIT_STATUS_COLORS[status]
        const isResolved = ['x', '~'].includes(status)

        html += `<span class="${statusColor}">${line.slice(0, 3)}</span>`
        html += `<span class="${isResolved ? hl.gray : 'text-content-secondary'}">${line.slice(3)}</span><br>`
      } else if (line.trim() !== '') {
        html += `<span class="underline">${line}</span><br>`
      } else {
        html += `${line}<br />`
      }
    })

    return html
  },

  plaintext: (text: string) => text,
}
