import { platform } from '@tauri-apps/api/os'
import { join, normalize } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'
import copyTextToClipboard from 'copy-text-to-clipboard'
import { useEventHandler } from './use-event-handler'
import { useStore } from '../state/use-store'
import { FileEntry } from '@tauri-apps/api/fs'
import { FileBrowserAction } from '../components/common/file-browser-item'

export const useFileActions = () => {
  const { files, prompt, openModal, router } = useStore()

  return useEventHandler(async (file: FileEntry, action: FileBrowserAction) => {
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
        router.navigate({
          name: 'default',
        })
        break
      }
      case 'new-file': {
        const name = await prompt.create({
          text: 'Enter a file name',
          submitText: 'Create',
        })
        if (name) {
          const path = await normalize(await join(file.path, name))
          await files.createFile(path)
          router.navigate({
            name: 'file',
            path,
            view: null,
          })
        }
        break
      }
      case 'new-folder': {
        const name = await prompt.create({
          text: 'Enter a folder name',
          submitText: 'Create',
        })
        if (name) {
          const path = await normalize(await join(file.path, name))
          await files.createFolder(path)
          router.navigate({
            name: 'file',
            path,
            view: null,
          })
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
      case 'open-in-file-viewer': {
        if ((await platform()) === 'darwin') {
          const cmd = new Command('open-in-finder', ['-R', file.path])

          console.log(cmd)

          const out = await cmd.execute()

          console.log(out)
        }
      }
    }
  })
}
