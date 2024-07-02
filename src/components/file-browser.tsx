import { Fragment } from 'preact';
import type { FileEntry } from '@tauri-apps/api/fs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import queryString from 'query-string'
import { swapArrayValue } from '../utils/swap-array-value';
import { useStore } from '../state/use-store';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';
import { memo } from 'preact/compat';
import { Icon } from './icon';
import { Button } from './button';

export const FileBrowser = memo(({
}) => {
  const store = useStore()
  const directoryBase = store.directoryBase.value
  const files = store.sortedFiles.value
  const selectedFile = store.currentView.value?.file
  const favorites = store.favorites.value

  const [expandedDirs, setExpandedDirs] = useState<string[]>([])

  useEffect(() => {
    setExpandedDirs([])
  }, [files])

  const handleClickItem = useCallback((file: FileEntry, action: FileBrowserAction) => {
    switch (action) {
      case 'toggle': {
        setExpandedDirs(prev => swapArrayValue(prev, file.path))
        break
      }
      case 'rename': {
        store.renameFile(file)
        break
      }
      case 'delete': {
        store.deleteFile(file)
      }
    }
  }, [store])

  const renderFile = (
    file: FileEntry,
    disabled = false,
    indent = 0,
  ) => {
    const isDir = file.children !== undefined
    const isExpanded = expandedDirs.includes(file.path)

    return (
      <Fragment key={file.path}>
        <FileBrowserItem
          file={file}
          isActive={file === selectedFile}
          isDisabled={disabled}
          indent={indent}
          onAction={handleClickItem}
          isExpandable={isDir}
          isExpanded={isExpanded}
        />
        {isDir && isExpanded && file.children?.map(file => {
          return renderFile(file, false, indent + 1)
        })}
      </Fragment>
    )
  }

  return (
    <div
      className={`
        flex flex-col gap-2
        w-sidebar h-screen
        pt-3 pb-3
        border-r-1 border-border
        fixed top-0 left-0
        overflow-y-auto
        bg-background-secondary
      `}
    >
      {favorites.length > 0 && (
        <>
          <h6 className="ps-3">
            Favorites
          </h6>
          <div className="mb-3 border-t-1 border-border">
            {favorites.map(favorite => {
              return renderFile(favorite.file, favorite.isBrokenFile || favorite.isBrokenView)
            })}
          </div>
        </>
      )}
      <div className="ps-3 pe-3 mb-2 flex items-center justify-between">
        <h6 className="mb-0">
          {directoryBase}&nbsp;/
        </h6>
        <button
          className="h-4"
          type="button"
          onClick={store.toggleQuickFind}
        >
          <Icon name="search" />
        </button>
      </div>
      <div className="mb-3 border-t-1 border-border">
        {files.map(file => renderFile(file))}
      </div>
      <div className="flex gap-2 ms-3 mt-auto">
        <Button size="small" onClick={store.openDirectoryPicker}>
          Change...
        </Button>
        <Button size="small" onClick={store.reloadDirectory}>
          Reload
        </Button>
      </div>
    </div>
  )
})
