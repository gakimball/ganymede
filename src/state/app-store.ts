import { signal } from '@preact/signals'
import autoBind from 'auto-bind';
import { PromptStore } from './prompt-store';
import { FileStore } from './file-store';
import { ViewStore } from './view-store';
import { FileEntry } from '@tauri-apps/api/fs';
import { createRouterState } from './router-state';

export const CREATE_NEW_RECORD = Symbol('CREATE_NEW_RECORD')

export type AppStoreModal =
  | { type: 'quick-find' }
  | { type: 'icon-picker'; file: FileEntry }
  | { type: 'new-database'; file: FileEntry }
  | { type: 'move'; file: FileEntry }

export class AppStore {
  readonly router = createRouterState({
    name: 'default',
  })

  readonly files = new FileStore()
  readonly views = new ViewStore(
    this.files.current,
    this.files.configFile,
    this.router
  )
  readonly prompt = new PromptStore()

  readonly currentModal = signal<AppStoreModal | null>(null);

  constructor() {
    autoBind(this)
    autoBind(this.views)
    autoBind(this.files)
    autoBind(this.prompt)
  }

  initialize(): void {
    this.files.reloadDirectory()
  }

  openModal(modal: AppStoreModal): void {
    this.currentModal.value = modal
  }

  closeModal(): void {
    this.currentModal.value = null
  }
}
