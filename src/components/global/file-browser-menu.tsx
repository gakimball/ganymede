import { FunctionComponent } from 'preact';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { useEventHandler } from '../../hooks/use-event-handler';
import { showMenu } from 'tauri-plugin-context-menu';
import { useStore } from '../../state/use-store';

export const FileBrowserMenu: FunctionComponent = () => {
  const { files, router } = useStore()

  const handleClick = useEventHandler(() => {
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
            router.navigate({
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
    <Button onClick={handleClick}>
      <div className="relative top-1">
        <Icon name="settings" />
      </div>
    </Button>
  )
}
