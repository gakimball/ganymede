import { useContext } from 'preact/hooks'
import { StoreContext } from './store-context'

export const useStore = () => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useStore() must be called within StoreContext.')
  }

  return store
}
