import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { memo } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { FileEntry } from '@tauri-apps/api/fs';
import { FileBrowserAction, FileBrowserItem } from '../common/file-browser-item';
import { useEventHandler } from '../../hooks/use-event-handler';
import { TextInput } from '../forms/text-input';
import { Modal } from '../common/modal';
import { NO_AUTOCOMPLETE } from '../../utils/constants';

export const QuickFind = memo(() => {
  const { files, currentModal, openModal, closeModal, router } = useStore()
  const fileList = files.flatFiles.value
  const fileIcons = files.fileIcons.value
  const fileCount = fileList.length
  const isOpen = currentModal.value?.type === 'quick-find'

  const [search, setSearch] = useState('')
  const [focusIndex, setFocusIndex] = useState(0)

  const results = useMemo(() => {
    const searchLower = search.toLocaleLowerCase().trim()
    if (searchLower === '') return []
    return fileList.filter(file => file.name?.toLocaleLowerCase().includes(searchLower))
  }, [search, fileList])

  const handleFileAction = useCallback((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'open') {
      router.navigate({
        name: 'file',
        path: file.path,
        view: null,
      })
      closeModal()
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
      case 'Escape': {
        closeModal()
        break
      }
    }
  })

  const handleWindowKey = useEventHandler((event: KeyboardEvent) => {
    if ((event.key === 'k' || event.key === 'p') && (event.metaKey || event.ctrlKey)) {
      if (isOpen) closeModal(); else openModal({ type: 'quick-find' })
    }
  })

  useEffect(() => {
    window.addEventListener('keypress', handleWindowKey)
    return () => window.removeEventListener('keypress', handleWindowKey)
  }, [])

  useEffect(() => {
    setSearch('')
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <Modal width="600px" height="400px">
      <div className="sticky top-0 z-10 mb-2">
        <TextInput
          type="url"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          onKeyDown={handleKeyAction}
          autoFocus
          {...NO_AUTOCOMPLETE}
        />
      </div>
      {results.map((result, index) => (
        <FileBrowserItem
          file={result}
          onAction={handleFileAction}
          isActive={index === focusIndex}
          fileIconMap={fileIcons}
        />
      ))}
    </Modal>
  )
})
