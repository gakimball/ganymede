import { Fragment } from 'preact';
import type { FileEntry } from '@tauri-apps/api/fs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { swapArrayValue } from '../../utils/swap-array-value';
import { useStore } from '../../state/use-store';
import { FileBrowserAction, FileBrowserItem } from '../common/file-browser-item';
import { memo } from 'preact/compat';
import { Icon } from '../common/icon';
import { Button } from '../common/button';
import { useEventHandler } from '../../hooks/use-event-handler';

export const FileBrowser = memo(({
}) => {
  const { files, prompt, toggleQuickFind } = useStore()
  const directoryBase = files.directoryBase.value
  const fileList = files.files.value
  const currentFile = files.current.value
  const favorites = files.favorites.value

  const [expandedDirs, setExpandedDirs] = useState<string[]>([])

  useEffect(() => {
    setExpandedDirs([])
  }, [fileList])

  const handleClickItem = useEventHandler(async (file: FileEntry, action: FileBrowserAction) => {
    switch (action) {
      case 'toggle': {
        setExpandedDirs(prev => swapArrayValue(prev, file.path))
        break
      }
      case 'rename': {
        const newName = await prompt.create({
          text: 'Enter a new file name',
          defaultValue: file.path,
          submitText: 'Rename',
        })
        if (newName) files.renameFile(file, newName)
        break
      }
      case 'delete': {
        files.deleteFile(file)
      }
    }
  })

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
          isActive={file === currentFile?.file}
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
              return renderFile(favorite.file, favorite.isBroken)
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
          onClick={toggleQuickFind}
        >
          <Icon name="search" />
        </button>
      </div>
      <div className="mb-3 border-t-1 border-border">
        {fileList.map(file => renderFile(file))}
      </div>
      <div className="flex gap-2 ms-3 mt-auto">
        <Button size="small" onClick={files.openDirectoryPicker}>
          Change...
        </Button>
        <Button size="small" onClick={files.reloadDirectory}>
          Reload
        </Button>
      </div>
    </div>
  )
})