import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { memo } from 'preact/compat';
import s from './quick-find.module.css'
import { useStore } from '../state/use-store';
import { FileEntry } from '@tauri-apps/api/fs';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';
import { useEventHandler } from '../hooks/use-event-handler';

export const QuickFind = memo(() => {
  const store = useStore()
  const files = store.files.value
  const fileCount = files.length
  const isOpen = store.quickFindOpen.value

  const [search, setSearch] = useState('')
  const [focusIndex, setFocusIndex] = useState(0)

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

  const handleKeyAction = useEventHandler((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setFocusIndex(prev => Math.max(0, prev - 1))
        event.preventDefault()
        break
      case 'ArrowDown':
        setFocusIndex(prev => Math.min(fileCount - 1, prev + 1))
        event.preventDefault()
        break
      case 'Enter': {
        const file = results[focusIndex]
        if (file) handleFileAction(file, 'open')
        event.preventDefault()
        break
      }
    }
  })

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
          type="search"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          onKeyDown={handleKeyAction}
          autoFocus
          autocapitalize="off"
          autocomplete="off"
        />
        <div className="list-group list-group-flush">
          {results.map((result, index) => (
            <FileBrowserItem
              file={result}
              onAction={handleFileAction}
              isActive={index === focusIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
})
