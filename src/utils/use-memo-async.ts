import { useEffect, useState } from 'preact/hooks'

/**
 * `useMemo`, but it can handle async values. Useful for Tauri's native APIs, which are
 * all async.
 */
export const useMemoAsync = <T>(
  get: () => Promise<T>,
  deps: unknown[]
) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    get().then(setValue)
  }, deps)

  return value
}
