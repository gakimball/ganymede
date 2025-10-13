import { Signal, batch, computed, signal } from '@preact/signals';

interface RouterTab {
  history: Signal<Route[]>;
  pointer: Signal<number>;
}

export type RouterState = ReturnType<typeof createRouterState>

export type Route =
  | { name: 'default' }
  | { name: 'file'; path: string; view: string | null; asText?: boolean }

export function createRouterState(initialRoute: Route) {
  const tabs = signal<RouterTab[]>([
    {
      history: signal([initialRoute]),
      pointer: signal(0),
    }
  ])

  const tabPointer = signal(0)

  const currentTab = computed(() => {
    const tab = tabs.value[tabPointer.value]

    if (!tab) {
      throw new Error(`No tab at index ${currentTab.value}`)
    }

    return tab
  })

  const currentRoute = computed(() => {
    const tab = currentTab.value
    const pointer = tab.pointer.value
    const current = tab.history.value[pointer]

    if (!current) {
      throw new Error(`No route at index ${pointer}`)
    }

    return current
  })

  return {
    tabs,
    currentTab,
    currentRoute,
  }
}

export function navigate(state: RouterState, route: Route) {
  const tab = state.currentTab.value
  const pointer = tab.pointer.value
  const history = tab.history.value

  batch(() => {
    const nextPointer = pointer + 1
    const nextHistory = history.slice(0, nextPointer)
    nextHistory.push(route)
    tab.pointer.value = nextPointer
    tab.history.value = nextHistory
  })
}

export function goBack(state: RouterState) {
  const tab = state.currentTab.value

  if (tab.pointer.value > 0) {
    tab.pointer.value--
  }
}

export function goForward(state: RouterState) {
  const tab = state.currentTab.value

  if (tab.pointer.value < tab.history.value.length - 1) {
    tab.pointer.value++
  }
}
