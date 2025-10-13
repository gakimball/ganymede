import { signal } from '@preact/signals';
import { FileEntry } from '@tauri-apps/api/fs';

export type ModalType =
  | { type: 'quick-find' }
  | { type: 'icon-picker'; file: FileEntry }
  | { type: 'new-database'; file: FileEntry }
  | { type: 'move'; file: FileEntry }

export type ModalState = ReturnType<typeof createModalState>

export function createModalState() {
  const current = signal<ModalType | null>(null)

  return {
    current,
  }
}

export function openModal(state: ModalState, type: ModalType) {
  state.current.value = type
}

export function closeModal(state: ModalState) {
  state.current.value = null
}
