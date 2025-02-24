import type { FileEntry } from '@tauri-apps/api/fs';
import { useStore } from '../../state/use-store';
import { FileBrowserAction } from '../common/file-browser-item';
import { memo } from 'preact/compat';
import { Icon } from '../common/icon';
import { useEventHandler } from '../../hooks/use-event-handler';
import { FileTree } from '../common/file-tree';
import { FileBrowserMenu } from './file-browser-menu';
import { useFileActions } from '../../hooks/use-file-actions';

const sortFiles = (a: FileEntry, b: FileEntry) => a.name!.localeCompare(b.name!)

export const FileBrowser = memo(() => {
  const { files, openModal } = useStore()
  const directoryBase = files.directoryBase.value
  const fileList = files.files.value
  const currentFile = files.current.value
  const favorites = files.favorites.value
  const fileIcons = files.fileIcons.value

  const handleFileAction = useFileActions()

  const handleFileMenuAction = useEventHandler(async (action: FileBrowserAction) => {
    await handleFileAction({
      path: files.directory.value,
      name: files.directory.value,
    }, action)
  })

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
            <FileTree
              files={favorites.map(favorite => favorite.file)}
              highlightedFiles={currentFile ? [currentFile.file] : []}
              disabledFiles={favorites.filter(favorite => favorite.isBroken).map(favorite => favorite.file)}
              fileIcons={fileIcons}
              onAction={handleFileAction}
            />
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
          onClick={() => openModal({ type: 'quick-find' })}
        >
          <Icon name="search" />
        </button>
      </div>
      <div className="mb-3 border-t-1 border-border">
        <FileTree
          files={fileList}
          highlightedFiles={currentFile ? [currentFile.file] : []}
          fileIcons={fileIcons}
          sortFiles={sortFiles}
          onAction={handleFileAction}
        />
      </div>
      <div className="ms-3 mt-auto">
        <FileBrowserMenu onAction={handleFileMenuAction} />
      </div>
    </div>
  )
})
