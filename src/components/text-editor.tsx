import { FunctionComponent } from 'preact';
import { useDebounce } from '../hooks/use-debounce';
import { useEffect, useRef } from 'preact/hooks';
import { FileEntry, writeTextFile } from '@tauri-apps/api/fs';
import { SyntaxHighlight, SyntaxHighlightRef } from './syntax-highlight';
import { useEventHandler } from '../hooks/use-event-handler';
import s from './text-editor.module.css'

interface TextEditorProps {
  file: FileEntry;
  contents: string;
}

export const TextEditor: FunctionComponent<TextEditorProps> = ({
  file,
  contents,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const syntaxHighlightRef = useRef<SyntaxHighlightRef>(null)

  const autosave = useDebounce(() => {
    writeTextFile(file.path, editorRef.current!.innerText)
  }, 1000)

  const updateSyntaxHighlight = useEventHandler(() => {
    syntaxHighlightRef.current?.updateText(editorRef.current!.innerText)
  })

  useEffect(() => {
    updateSyntaxHighlight()
  }, [])

  return (
    <div className={s.container}>
      <div
        ref={editorRef}
        className={`font-monospace ${s.editor}`}
        contentEditable="plaintext-only"
        onInput={() => {
          autosave()
          updateSyntaxHighlight()
        }}
      >
        {contents}
      </div>
      <div className={`font-monospace ${s.overlay}`}>
        <SyntaxHighlight ref={syntaxHighlightRef} fileName={file.path} />
      </div>
    </div>
  )
}
