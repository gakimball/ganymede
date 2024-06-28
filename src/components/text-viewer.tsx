import { memo } from 'preact/compat';
import { useStore } from '../state/use-store';
import { TextEditor } from './text-editor';

export const TextViewer = memo(() => {
  const store = useStore()
  const view = store.currentView.value

  if (view?.type !== 'text') {
    return null
  }

  return (
    <TextEditor
      key={view.file.path}
      file={view.file}
      contents={view.contents}
    />
  )
})
