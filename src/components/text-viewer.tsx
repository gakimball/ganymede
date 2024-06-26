import { FunctionComponent } from 'preact';
import s from './text-viewer.module.css'
import { useDebounce } from '../hooks/use-debounce';
import { useRef } from 'preact/hooks';
import { FileEntry, writeTextFile } from '@tauri-apps/api/fs';

interface TextViewerProps {
  file: FileEntry;
  contents: string;
}

export const TextViewer: FunctionComponent<TextViewerProps> = ({
  file,
  contents,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autosave = useDebounce(() => {
    if (!textareaRef.current) {
      return
    }
    writeTextFile(file.path, textareaRef.current.value)
  }, 1000)

  return (
    <textarea
      ref={textareaRef}
      className={`form-control font-monospace border-0 ${s.textarea}`}
      defaultValue={contents}
      rows={12}
      onInput={autosave}
    ></textarea>
  )
}
