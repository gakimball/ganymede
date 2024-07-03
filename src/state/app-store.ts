import { signal } from '@preact/signals'
import autoBind from 'auto-bind';
import { FavoritesEntry } from '../types/favorites-entry';
import { PromptStore } from './prompt-store';
import { FileStore } from './file-store';
import { ViewStore } from './view-store';

export const CREATE_NEW_RECORD = Symbol('CREATE_NEW_RECORD')

export class AppStore {
  readonly files = new FileStore()
  readonly views = new ViewStore(
    this.files.current,
    this.files.viewsFile
  )
  readonly prompt = new PromptStore()

  readonly quickFindOpen = signal(false);

  constructor() {
    autoBind(this)
    autoBind(this.views)
    autoBind(this.files)
    autoBind(this.prompt)
  }

  initialize(): void {
    this.files.reloadDirectory()
  }

  toggleQuickFind(): void {
    this.quickFindOpen.value = !this.quickFindOpen.value
  }
}
