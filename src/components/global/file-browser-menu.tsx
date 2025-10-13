import { FunctionComponent } from 'preact';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { useEventHandler } from '../../hooks/use-event-handler';
import { showMenu } from 'tauri-plugin-context-menu';
import { useStore } from '../../state/use-store';
import { FileBrowserAction } from '../common/file-browser-item';
import { navigate } from '../../state/router-state';

interface FileBrowserProps {
  onAction: (action: FileBrowserAction) => void;
}

export const FileBrowserMenu: FunctionComponent<FileBrowserProps> = ({
  onAction,
}) => {
  const { files, router } = useStore()

  const showFileMenu = useEventHandler(() => {
    showMenu({
      items: [
        {
          label: 'New file',
          event: () => onAction('new-file'),
        },
        {
          label: 'New database',
          event: () => onAction('new-database'),
        },
        {
          label: 'New folder',
          event: () => onAction('new-folder'),
        },
      ]
    })
  })

  const showSettingsMenu = useEventHandler(() => {
    showMenu({
      items: [
        {
          label: 'Reload folder',
          event: () => {
            files.reloadDirectory()
          },
        },
        {
          label: 'Edit config database',
          event: () => {
            navigate(router, {
              name: 'file',
              path: files.configFile.value!.path,
              view: null,
              asText: true,
            })
          }
        },
        {
          label: 'Change folder...',
          event: () => {
            files.openDirectoryPicker()
          },
        },
      ]
    })
  })

  return (
    <div className="flex gap-2">
      <Button onClick={showFileMenu}>
        <div className="relative top-1">
          <Icon name="plus" />
        </div>
      </Button>
      <Button onClick={showSettingsMenu}>
        <div className="relative top-1">
          <Icon name="settings" />
        </div>
      </Button>
    </div>
  )
}
