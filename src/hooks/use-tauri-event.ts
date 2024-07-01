import { EventName, listen } from '@tauri-apps/api/event';
import { useEffect, useRef } from 'preact/hooks';

export const useTauriEvent = (event: EventName, callback: () => void) => {
  const callbackRef = useRef(callback)

  callbackRef.current = callback

  useEffect(() => {
    let unlisten

    listen(event, callbackRef.current).then(fn => {
      unlisten = fn
    })

    return unlisten
  }, [])
}
