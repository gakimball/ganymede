import { memo, useMemo } from 'preact/compat';
import { useStore } from '../../state/use-store';
import { Modal } from '../common/modal';
import { FileEntry } from '@tauri-apps/api/fs';
import { FileTree } from '../common/file-tree';
import { useEventHandler } from '../../hooks/use-event-handler';
import { FileBrowserAction } from '../common/file-browser-item';

export const MoveFileModal = memo(() => {
  const store = useStore()
  const modal = store.currentModal.value

  if (modal?.type !== 'move') {
    return null
  }

  const fileList = store.files.files.value
  const directory = store.files.directory.value
  const files = useMemo<FileEntry[]>(() => [{
    path: directory,
    children: fileList,
    name: '/',
  }], [directory, fileList])

  const handleFileAction = useEventHandler((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'open' && file.children) {
      store.files.moveFile(modal.file, file)
      store.closeModal()
    }
  })

  return (
    <Modal width="500px" height="500px">
      <p>Move to...</p>
      <FileTree
        files={files}
        fileIcons={store.files.fileIcons.value}
        onAction={handleFileAction}
      />
    </Modal>
  )
})
