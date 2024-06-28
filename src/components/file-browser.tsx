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
    <div className="d-grid gap-2">
      {favorites.length > 0 && (
        <>
          <h6>Favorites</h6>
          <div className="list-group mb-3">
            {favorites.map(favorite => {
              return renderFile(favorite.file, favorite.isBrokenFile || favorite.isBrokenView)
            })}
          </div>
        </>
      )}
      <h6>Directory</h6>
      <div className="list-group mb-2">
        {files.map(file => renderFile(file))}
      </div>
      <button
        className="btn btn-outline-secondary btn-sm"
        type="button"
        onClick={store.openDirectoryPicker}
      >
        Set directory
      </button>
    </div>
  )
})
