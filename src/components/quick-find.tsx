import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { memo } from 'preact/compat';
import s from './quick-find.module.css'
import { useStore } from '../state/use-store';
import { FileEntry } from '@tauri-apps/api/fs';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';

export const QuickFind = memo(() => {
  const store = useStore()
  const files = store.files.value
  const isOpen = store.quickFindOpen.value

  const [search, setSearch] = useState('')

  const flatFiles = useMemo(() => {
    const mapFile = (file: FileEntry): FileEntry[] => file.children?.flatMap(mapFile) ?? [file]
    return files.flatMap(mapFile)
  }, [files])

  const results = useMemo(() => {
    const searchLower = search.toLocaleLowerCase().trim()
    if (searchLower === '') return []
    return flatFiles.filter(file => file.name?.toLocaleLowerCase().includes(searchLower))
  }, [search, flatFiles])

  const handleFileAction = useCallback((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'open') {
      store.openFile(file)
      store.toggleQuickFind()
    }
  }, [])

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        store.toggleQuickFind()
      }
    }
    window.addEventListener('keypress', handle)
    return () => window.removeEventListener('keypress', handle)
  }, [])

  if (!isOpen) {
    return null
  }

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        <input
          className="form-control mb-3 position-sticky top-0 z-1"
          type="text"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          autoFocus
        />
        <div className="list-group list-group-flush">
          {results.map(result => (
            <FileBrowserItem
              file={result}
              onAction={handleFileAction}
            />
          ))}
        </div>
      </div>
    </div>
  )
})
