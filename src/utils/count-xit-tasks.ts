import { XIT_TASK_REGEX } from './constants'

export const countXitTasks = (input: string) => {
  let match
  let total = 0
  let complete = 0
  let pending = 0
  let question = 0
  const re = new RegExp(XIT_TASK_REGEX, 'gm')

  while ((match = re.exec(input)) !== null) {
    const char = match.groups?.status
    if (!char) continue

    total += 1
    switch (char) {
      case '@': pending += 1; break;
      case 'x': case '~': complete += 1; break;
      case '?': question += 1; break;
    }
  }

  return {
    total,
    complete,
    pending,
    question,
  }
}
