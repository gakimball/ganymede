import { batch, computed, signal } from '@preact/signals'

export type Route =
  | { name: 'default' }
  | { name: 'file'; path: string; view: string | null }

export class RouterStore {
  private readonly history = signal<Route[]>([])

  private readonly pointer = signal(0)

  readonly current = computed(() => {
    const pointer = this.pointer.value
    const current = this.history.value[pointer]

    if (!current) {
      throw new Error(`No route at index ${pointer}`)
    }

    return current
  })

  constructor(
    initialRoute: Route,
  ) {
    this.history.value.push(initialRoute)
  }

  navigate(route: Route): void {
    const pointer = this.pointer.value
    const history = this.history.value

    batch(() => {
      const nextPointer = pointer + 1
      const nextHistory = history.slice(0, nextPointer)
      nextHistory.push(route)
      this.pointer.value = nextPointer
      this.history.value = nextHistory
    })
  }

  goBack(): void {
    if (this.pointer.value > 0) {
      this.pointer.value--
    }
  }

  goForward(): void {
    if (this.pointer.value < this.history.value.length - 1) {
      this.pointer.value++
    }
  }
}
