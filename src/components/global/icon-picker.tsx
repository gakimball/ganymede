import { FunctionComponent } from 'preact';
import { FeatherIconNames, icons } from 'feather-icons'
import { Modal } from '../common/modal';
import { useState } from 'preact/hooks';
import { TextInput } from '../forms/text-input';
import { Icon } from '../common/icon';
import { Button } from '../common/button';
import { useStore } from '../../state/use-store';
import { NO_AUTOCOMPLETE } from '../../utils/constants';
import { closeModal } from '../../state/modal-state';

export const IconPicker: FunctionComponent = () => {
  const { modal, files } = useStore()
  const currentModal = modal.current.value
  const isOpen = currentModal?.type === 'icon-picker'
  const [search, setSearch] = useState('')

  if (!isOpen) {
    return null
  }

  const allIcons = Object.keys(icons).filter(name => {
    return name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  }) as FeatherIconNames[]

  const changeIcon = async (icon: string | null) => {
    await files.changeFileIcon(currentModal.file, icon)
    closeModal(modal)
  }

  return (
    <Modal width="600px" height="400px">
      <div className="sticky top-0 z-10 mb-2 flex gap-2">
        <TextInput
          type="search"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          autoFocus
          {...NO_AUTOCOMPLETE}
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
