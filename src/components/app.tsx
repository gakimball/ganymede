import { useEffect, useRef } from 'preact/hooks'
import { FileBrowser } from './global/file-browser'
import { AppStore } from '../state/app-store'
import { StoreContext } from '../state/store-context'
import { QuickFind } from './global/quick-find'
import { ThemeManager } from './managers/theme-manager'
import { EmptyLayout } from './layouts/empty-layout'
import { Prompt } from './global/prompt'
import { FileRoute } from './routes/file-route'
import { ShortcutManager } from './managers/shortcut-manager'
import { IconPicker } from './global/icon-picker'
import { RouteHandler } from './global/route-handler'

const initialState = new AppStore()

export const App = () => {
  const { current: store } = useRef(initialState)

  useEffect(() => {
    store.initialize()
  }, [store])

  return (
    <StoreContext.Provider value={store}>
      <ThemeManager />
      <ShortcutManager />
      <FileBrowser />
      <QuickFind />
      <Prompt />
      <IconPicker />
      <div className="ms-sidebar">
        <RouteHandler>
          {(route) => (
            <>
              {route.name === 'default' && <EmptyLayout />}
              {route.name === 'file' && (
                <FileRoute
                  path={route.path}
                  view={route.view}
                />
              )}
            </>
          )}
        </RouteHandler>
      </div>
    </StoreContext.Provider>
  )
}
