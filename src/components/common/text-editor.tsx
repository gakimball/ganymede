import { FunctionComponent } from 'preact';
import { useDebounce } from '../../hooks/use-debounce';
import { useEffect, useRef } from 'preact/hooks';
import { FileEntry, writeTextFile } from '@tauri-apps/api/fs';
import { SyntaxHighlight, SyntaxHighlightRef } from './syntax-highlight';
import { useEventHandler } from '../../hooks/use-event-handler';

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
    editorRef.current?.focus()
  }, [])

  return (
    <div className="mt-3 ms-3 relative min-h-full">
      <div
        ref={editorRef}
        className={`
          overflow-hidden
          px-2 py-3
          font-mono
          text-transparent text-base caret-content
          whitespace-pre-wrap
          focus:outline-none
        `}
        contentEditable="plaintext-only"
        onInput={() => {
          autosave()
          updateSyntaxHighlight()
        }}
      >
        {contents}
      </div>
      <div
        className={`
          absolute top-0 left-0
          size-full
          px-2 py-3
          font-mono text-base
          pointer-events-none
          whitespace-pre-wrap
        `}
      >
        <SyntaxHighlight ref={syntaxHighlightRef} fileName={file.path} />
      </div>
    </div>
  )
}
