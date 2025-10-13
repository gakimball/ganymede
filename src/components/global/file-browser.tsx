import type { FileEntry } from '@tauri-apps/api/fs';
import { useStore } from '../../state/use-store';
import { FileBrowserAction } from '../common/file-browser-item';
import { memo } from 'preact/compat';
import { Icon } from '../common/icon';
import { useEventHandler } from '../../hooks/use-event-handler';
import { FileTree } from '../common/file-tree';
import { FileBrowserMenu } from './file-browser-menu';
import { useFileActions } from '../../hooks/use-file-actions';
import { openModal } from '../../state/modal-state';

const sortFiles = (a: FileEntry, b: FileEntry) => a.name!.localeCompare(b.name!)

export const FileBrowser = memo(() => {
  const { files, modal } = useStore()
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
        fixed top-0 left-0
        overflow-y-auto
        bg-background-secondary
      `}
    >
      <div className="ps-3 pe-3 pb-4 mb-2 flex items-center justify-between border-b-1 border-border">
        <h6 className="mb-0">
          {directoryBase}&nbsp;/
        </h6>
        <button
          className="h-4"
          type="button"
          onClick={() => openModal(modal, { type: 'quick-find' })}
        >
          <Icon name="search" />
        </button>
      </div>
      {favorites.length > 0 && (
        <div className="mb-3 px-1">
          <FileTree
            files={favorites.map(favorite => favorite.file)}
            highlightedFiles={currentFile ? [currentFile.file] : []}
            disabledFiles={favorites.filter(favorite => favorite.isBroken).map(favorite => favorite.file)}
            fileIcons={fileIcons}
            onAction={handleFileAction}
          />
        </div>
      )}
      <div className="mb-3 px-1">
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
