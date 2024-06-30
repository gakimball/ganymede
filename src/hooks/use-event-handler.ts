import { useCallback, useRef } from 'preact/hooks'

export const useEventHandler = <T extends unknown[], U>(fn: (...args: T) => U) => {
  const fnRef = useRef(fn)

  fnRef.current = fn

  return useCallback((...args: T) => fnRef.current(...args), [])
}
