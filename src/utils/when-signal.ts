import { Signal, effect } from '@preact/signals';

export const when = <T>(
  signal: Signal<T>,
  condition: (value: T) => boolean
) => {
  return new Promise<void>((resolve, reject) => {
    const unsubscribe = effect(() => {
      try {
        if (condition(signal.value)) {
          unsubscribe()
          resolve()
        }
      } catch (err) {
        reject(err)
      }
    })
  })
}
