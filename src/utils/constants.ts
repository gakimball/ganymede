export const DIRECTORY_LOCALSTORAGE_KEY = 'dir'
export const LAST_VIEWED_LOCALSTORAGE_KEY = 'lastviewed'
export const XIT_TASK_REGEX = /^\[(?<status> |x|@|~|\?)\]/

export const NO_AUTOCOMPLETE = {
  autocomplete: 'off',
  autocorrect: 'off',
  autocapitalize: 'off',
  spellCheck: false,
} as const
