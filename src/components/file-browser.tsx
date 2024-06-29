import { Fragment } from 'preact';
import type { FileEntry } from '@tauri-apps/api/fs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { swapArrayValue } from '../utils/swap-array-value';
import { useStore } from '../state/use-store';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';
import { memo } from 'preact/compat';

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
      case 'open': {
        if (file.children) {
          setExpandedDirs(prev => swapArrayValue(prev, file.path))
        } else {
          store.openFile(file)
        }
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
  ) => (
    <Fragment key={file.path}>
      <FileBrowserItem
        file={file}
        isActive={file === selectedFile}
        isDisabled={disabled}
        indent={indent}
        onAction={handleClickItem}
      />
      {file.children && expandedDirs.includes(file.path) && file.children.map(file => {
        return renderFile(file, false, indent + 1)
      })}
    </Fragment>
  )

  return (
    <div
      className={`
        d-flex flex-column gap-2
        h-100
        pt-3 pb-3
        border-end
        position-fixed top-0 left-0
        overflow-y-auto
      `}
      style={{
        '--bs-body-bg': '#262626',
        width: 'var(--App-sidebar-width)',
        height: '100vh',
        background: 'var(--bs-body-bg)',
      }}
    >
      {favorites.length > 0 && (
        <>
          <h6 className="ps-3">Favorites</h6>
          <div className="list-group list-group-flush mb-3 border-top">
            {favorites.map(favorite => {
              return renderFile(favorite.file, favorite.isBrokenFile || favorite.isBrokenView)
            })}
          </div>
        </>
      )}
      <h6 className="ps-3">
        {directoryBase}&nbsp;/
      </h6>
      <div className="list-group list-group-flush mb-3 border-top">
        {files.map(file => renderFile(file))}
      </div>
      <div className="d-flex gap-2 ms-3 mt-auto">
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={store.openDirectoryPicker}
        >
          Change...
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={store.reloadDirectory}
        >
          Reload
        </button>
      </div>
    </div>
  )
})
