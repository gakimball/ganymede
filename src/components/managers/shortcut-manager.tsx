import { memo, useEffect } from 'preact/compat';
import { useStore } from '../../state/use-store';

export const ShortcutManager = memo(() => {
  const { router } = useStore()

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === '[' && (event.metaKey || event.ctrlKey)) {
        router.goBack()
      } else if (event.key === ']' && (event.metaKey || event.ctrlKey)) {
        router.goForward()
      }
    }
    window.addEventListener('keypress', handle)
    return () => window.removeEventListener('keypress', handle)
  }, [])

  return null
})
