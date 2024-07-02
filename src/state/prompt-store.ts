import { signal } from '@preact/signals';

export interface PromptPayload {
  text: string;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
}

export class PromptStore {
  readonly current = signal<PromptPayload | null>(null)

  private resolver?: (value: string | null) => void;

  create(payload: PromptPayload): Promise<string | null> {
    this.current.value = payload

    return new Promise<string | null>((resolve) => {
      // Resolve an existing Promise just in case
      this.resolver?.(null)
      this.resolver = resolve
    })
  }

  resolve(value: string | null): void {
    this.resolver?.(value)
    this.resolver = undefined
    this.current.value = null
  }
}
