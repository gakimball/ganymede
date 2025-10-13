import { memo, useEffect } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { goBack, goForward } from '../../state/router-state';

export const ShortcutManager = memo(() => {
  const { router } = useStore()

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === '[' && (event.metaKey || event.ctrlKey)) {
        goBack(router)
      } else if (event.key === ']' && (event.metaKey || event.ctrlKey)) {
        goForward(router)
      }
    }
    window.addEventListener('keypress', handle)
    return () => window.removeEventListener('keypress', handle)
  }, [])

  return null
})
