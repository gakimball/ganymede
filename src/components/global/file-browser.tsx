import type { FileEntry } from '@tauri-apps/api/fs';
import copyTextToClipboard from 'copy-text-to-clipboard';
import { useStore } from '../../state/use-store';
import { FileBrowserAction } from '../common/file-browser-item';
import { memo } from 'preact/compat';
import { Icon } from '../common/icon';
import { Button } from '../common/button';
import { useEventHandler } from '../../hooks/use-event-handler';
import { join, normalize, sep } from '@tauri-apps/api/path';
import { FileTree } from '../common/file-tree';

const sortFiles = (a: FileEntry, b: FileEntry) => a.name!.localeCompare(b.name!)

export const FileBrowser = memo(() => {
  const { files, prompt, openModal, router } = useStore()
  const directoryBase = files.directoryBase.value
  const fileList = files.files.value
  const currentFile = files.current.value
  const favorites = files.favorites.value
  const fileIcons = files.fileIcons.value

  const handleFileAction = useEventHandler(async (file: FileEntry, action: FileBrowserAction) => {
    switch (action) {
      case 'open': {
        router.navigate({
          name: 'file',
          path: file.path,
          view: null,
        })
        break
      }
      case 'rename': {
        const newName = await prompt.create({
          text: 'Enter a new file name',
          defaultValue: file.name,
          submitText: 'Rename',
        })
        if (newName) files.renameFile(file, newName)
        break
      }
      case 'delete': {
        files.deleteFile(file)
        break
      }
      case 'new-file': {
        const name = await prompt.create({
          text: 'Enter a file name',
          submitText: 'Create',
        })
        if (name) {
          const path = await normalize(await join(file.path, '..', name))
          await files.createFile(path)
        }
        break
      }
      case 'new-folder': {
        const name = await prompt.create({
          text: 'Enter a folder name',
          submitText: 'Create',
        })
        if (name) {
          const path = await normalize(await join(file.path, '..', name))
          await files.createFolder(path)
        }
        break
      }
      case 'new-database': {
        openModal({
          type: 'new-database',
          file,
        })
        break
      }
      case 'icon': {
        openModal({
          type: 'icon-picker',
          file,
        })
        break
      }
      case 'copy-path': {
        copyTextToClipboard(file.path)
        break
      }
      case 'move': {
        openModal({
          type: 'move',
          file,
        })
        break
      }
    }
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
