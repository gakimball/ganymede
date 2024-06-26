import { useCallback, useEffect, useRef } from 'preact/hooks'

export const useDebounce = (
  fn: () => unknown,
  timeout: number,
) => {
  const fnRef = useRef(fn)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => cancelTimeout, [cancelTimeout])

  return useCallback(() => {
    cancelTimeout()
    timeoutRef.current = setTimeout(fnRef.current, timeout)
  }, [])
}
