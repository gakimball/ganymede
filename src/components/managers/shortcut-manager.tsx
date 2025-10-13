import { memo, useEffect } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { goBack, goForward, newTab } from '../../state/router-state';

export const ShortcutManager = memo(() => {
  const { router } = useStore()

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      const superr = (event.metaKey || event.ctrlKey)
      const shift = event.shiftKey

      if (event.key === '[' && superr) {
        goBack(router)
      } else if (event.key === ']' && superr) {
        goForward(router)
      }

      if (event.key === 'T' && superr) {
        newTab(router, {
          name: 'default',
        })
      }
    }
    window.addEventListener('keypress', handle)
    return () => window.removeEventListener('keypress', handle)
  }, [])

  return null
})
