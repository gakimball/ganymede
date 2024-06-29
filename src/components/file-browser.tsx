import { Fragment } from 'preact';
import type { FileEntry } from '@tauri-apps/api/fs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { swapArrayValue } from '../utils/swap-array-value';
import { useStore } from '../state/use-store';
import { FileBrowserItem } from './file-browser-item';
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

  const handleClickItem = useCallback((file: FileEntry) => {
    if (file.children) {
      setExpandedDirs(prev => swapArrayValue(prev, file.path))
    } else {
      store.openFile(file)
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
        onClick={handleClickItem}
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
      `}
      style={{
        width: '300px',
        height: '100vh',
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
        {directoryBase}/
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
          Set directory
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={store.reloadDirectory}
        >
          Reload directory
        </button>
      </div>
    </div>
  )
})
