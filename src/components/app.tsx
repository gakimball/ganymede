import { useEffect, useRef } from 'preact/hooks'
import { FileBrowser } from './global/file-browser'
import { AppStore } from '../state/app-store'
import { StoreContext } from '../state/store-context'
import { QuickFind } from './global/quick-find'
import { ThemeManager } from './managers/theme-manager'
import { EmptyLayout } from './layouts/empty-layout'
import { Prompt } from './global/prompt'
import { LocationProvider, Route, Router } from 'preact-iso'
import { FileRoute } from './routes/file-route'
import { ShortcutManager } from './managers/shortcut-manager'
import { IconPicker } from './global/icon-picker'

const initialState = new AppStore()

export const App = () => {
  const { current: store } = useRef(initialState)

  useEffect(() => {
    store.initialize()
  }, [store])

  return (
    <StoreContext.Provider value={store}>
      <LocationProvider>
        <ThemeManager />
        <ShortcutManager />
        <FileBrowser />
        <QuickFind />
        <Prompt />
        <IconPicker />
        <div className="ms-sidebar">
          <Router>
            <Route path="/" component={EmptyLayout} />
            <Route path="/file" component={FileRoute} />
          </Router>
        </div>
      </LocationProvider>
    </StoreContext.Provider>
  )
}
