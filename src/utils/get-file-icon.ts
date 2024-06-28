import { FileEntry } from '@tauri-apps/api/fs'
import { FeatherIconNames } from 'feather-icons'

export const getFileIcon = (file: FileEntry): FeatherIconNames => {
  if (file.children) {
    return 'folder'
  }
  if (file.path.endsWith('.rec')) {
    return 'database'
  }
  if (file.path.endsWith('.xit')) {
    return 'check-square'
  }
  return 'file'
}
