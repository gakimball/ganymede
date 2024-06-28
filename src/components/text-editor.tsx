import { FunctionComponent } from 'preact';
import { useDebounce } from '../hooks/use-debounce';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { FileEntry, writeTextFile } from '@tauri-apps/api/fs';
import { XitOverlay } from './xit-overlay';
import { MarkdownOverlay } from './markdown-overlay';
import s from './text-editor.module.css'

interface TextEditorProps {
  file: FileEntry;
  contents: string;
}

export const TextEditor: FunctionComponent<TextEditorProps> = ({
  file,
  contents,
}) => {
  const [value, setValue] = useState(contents)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaHeightRef = useRef(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>()
  const lineCountRef = useRef(0)

  const autosave = useDebounce(() => {
    writeTextFile(file.path, textareaRef.current!.value)
  }, 1000)

  const recalculate = useCallback((lineCount: number) => {
    const minHeight = scrollAreaHeightRef.current
    const height = 12 + (24 * lineCount)

    console.log(`Height is ${Math.max(height, minHeight)}`)

    textareaRef.current!.style.height = `${Math.max(height, minHeight)}px`
  }, [])

  const checkForRecalculate = useCallback((text: string) => {
    const lineCount = text.split('\n').length

    if (lineCount !== lineCountRef.current) {
      lineCountRef.current = lineCount
      recalculate(lineCount)
    }
  }, [recalculate])

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(entries => {
      scrollAreaHeightRef.current = entries[0].contentRect.height
    })
    resizeObserverRef.current.observe(scrollAreaRef.current!)
    checkForRecalculate(textareaRef.current!.value)
  }, [])

  return (
    <div ref={scrollAreaRef} className={s.scrollArea}>
      <div className={s.container}>
        <textarea
          ref={textareaRef}
          className={`form-control font-monospace border-0 ${s.textarea}`}
          value={value}
          onChange={event => {
            autosave()
            setValue(event.currentTarget.value)
            checkForRecalculate(event.currentTarget.value)
          }}
        ></textarea>
        <div className={s.overlay}>
          {file.name?.endsWith('.xit') && (
            <XitOverlay value={value} />
          )}
          {(file.name?.endsWith('.md') || file.name?.endsWith('.gmi')) && (
            <MarkdownOverlay value={value} />
          )}
        </div>
      </div>
    </div>
  )
}
