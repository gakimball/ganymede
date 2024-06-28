import { useContext } from 'preact/hooks'
import { StateContext } from './state-context'

export const useStore = () => {
  const store = useContext(StateContext)

  if (!store) {
    throw new Error('useStore() must be called within StateContext.')
  }

  return store
}
