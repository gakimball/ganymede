import { platform } from '@tauri-apps/api/os'
import { join, normalize } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'
import copyTextToClipboard from 'copy-text-to-clipboard'
import { useEventHandler } from './use-event-handler'
import { useStore } from '../state/use-store'
import { FileEntry } from '@tauri-apps/api/fs'
import { FileBrowserAction } from '../components/common/file-browser-item'
import { navigate } from '../state/router-state'
import { openModal } from '../state/modal-state'
import { getDefaultNewFileName } from '../utils/get-default-new-file-name'

export const useFileActions = () => {
  const { files, prompt, modal, router } = useStore()

  return useEventHandler(async (file: FileEntry, action: FileBrowserAction) => {
    switch (action) {
      case 'open': {
        navigate(router, {
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
        navigate(router, {
          name: 'default',
        })
        break
      }
      case 'new-file': {
        const name = await prompt.create({
          text: 'Enter a file name',
          submitText: 'Create',
          defaultValue: await getDefaultNewFileName(file),
        })
        if (name) {
          const path = await normalize(await join(file.path, name))
          await files.createFile(path)
          navigate(router, {
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
          navigate(router, {
            name: 'file',
            path,
            view: null,
          })
        }
        break
      }
      case 'new-database': {
        openModal(modal, {
          type: 'new-database',
          file,
        })
        break
      }
      case 'icon': {
        openModal(modal, {
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
        openModal(modal, {
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
