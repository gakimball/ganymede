import { memo } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { Route, changeTab } from '../../state/router-state';

export const RouterTabs = memo(() => {
  const { router } = useStore()

  return (
    <div
      class={`
        flex
        w-full
        border-b-1
        border-b-border
        pt-3 pb-3
      `}
    >
      {router.tabs.value.map((tab, index) => {
        const history = tab.history.value
        const route = history[history.length - 1]

        return (
          <button
            key={index}
            type="button"
            onClick={() => changeTab(router, index)}
          >
            {stringifyRoute(route)}
          </button>
        )
      })}
    </div>
  )
})

function stringifyRoute(route: Route) {
  switch (route.name) {
    case 'file':
      return route.path
    case 'default':
      return '(empty)'
  }
}
