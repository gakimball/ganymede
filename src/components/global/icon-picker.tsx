import { FunctionComponent } from 'preact';
import { FeatherIconNames, icons } from 'feather-icons'
import { Modal } from '../common/modal';
import { useCallback, useState } from 'preact/hooks';
import { TextInput } from '../forms/text-input';
import { Icon } from '../common/icon';
import { Button } from '../common/button';
import { useStore } from '../../state/use-store';
import { useEventHandler } from '../../hooks/use-event-handler';

export const IconPicker: FunctionComponent = () => {
  const store = useStore()
  const currentModal = store.currentModal.value
  const isOpen = currentModal?.type === 'icon-picker'
  const [search, setSearch] = useState('')

  if (!isOpen) {
    return null
  }

  const allIcons = Object.keys(icons).filter(name => {
    return name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }) as FeatherIconNames[]

  const changeIcon = async (icon: string | null) => {
    await store.files.changeFileIcon(currentModal.file, icon)
    store.closeModal()
  }

  return (
    <Modal width="600px" height="400px">
      <div className="sticky top-0 z-10 mb-2 flex gap-2">
        <TextInput
          type="search"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          autoFocus
          autocapitalize="off"
          autocomplete="off"
        />
        <Button
          type="button"
          theme="danger"
          onClick={() => changeIcon(null)}
        >
          Clear icon
        </Button>
      </div>
      {allIcons.map(icon => (
        <button
          className={`
            flex items-center gap-3
            w-full
            ps-2 py-2
            select-none
          hover:bg-background-highlight
            rounded-md
          `}
          type="button"
          onClick={() => changeIcon(icon)}
        >
          <div className="h-icon">
            <Icon name={icon} />
          </div>
          <p>{icon}</p>
        </button>
      ))}
    </Modal>
  )
}
