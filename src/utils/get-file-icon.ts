import { FileEntry } from '@tauri-apps/api/fs'
import { FeatherIconNames } from 'feather-icons'

export const getFileIcon = (
  file: FileEntry,
  iconMap: Record<string, FeatherIconNames | undefined>,
): FeatherIconNames => {
  if (file.name) {
    const icon = iconMap[file.name]
    if (icon) return icon
  }

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
