import { FileEntry } from '@tauri-apps/api/fs';
import { memo } from 'preact/compat';
import { Icon } from './icon';

interface FileBrowserIconProps {
  file: FileEntry;
}

export const FileBrowserIcon = memo<FileBrowserIconProps>(({
  file,
}) => {
  if (file.children) {
    return <Icon size={16} name="folder" />
  }

  if (file.path.endsWith('.rec')) {
    return <Icon size={16} name="database" />
  }

  if (file.path.endsWith('.xit')) {
    return <Icon size={16} name="check-square" />
  }

  return <Icon size={16} name="file" />
})
