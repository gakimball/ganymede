import { memo, useEffect } from 'preact/compat';

export const ShortcutManager = memo(() => {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === '[' && (event.metaKey || event.ctrlKey)) {
        history.back()
      } else if (event.key === ']' && (event.metaKey || event.ctrlKey)) {
        history.forward()
      }
    }
    window.addEventListener('keypress', handle)
    return () => window.removeEventListener('keypress', handle)
  }, [])

  return null
})
