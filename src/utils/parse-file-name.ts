import { FileEntry } from '@tauri-apps/api/fs'
import getExt from 'get-ext'

export const parseFileName = (file: FileEntry) => {
  let name = file?.name ?? file.path
  const isDir = !!file.children
  const jdNumber = name.match(/^\d\d(\.\d\d)?\s/)?.[0]
  const ext = isDir ? '' : getExt(name)
  // const displayName = (isDir || ext.length === 0) ? file.name : file.name?.slice(0, -ext.length)

  if (jdNumber) {
    name = name.slice(jdNumber.length)
  }

  if (!(isDir || ext.length === 0)) {
    name = name.slice(0, -ext.length)
  }

  return {
    jdNumber,
    name,
    ext,
  }
}
