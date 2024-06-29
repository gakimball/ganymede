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
  const [disableHighlight, setDisableHighlight] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerHeightRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>()
  const lineCountRef = useRef(0)

  const autosave = useDebounce(() => {
    writeTextFile(file.path, textareaRef.current!.value)
  }, 1000)

  const recalculate = useCallback((lineCount: number) => {
    const minHeight = containerHeightRef.current
    const height = 12 + (24 * lineCount)
    const finalHeight = Math.max(height, minHeight)

    console.log(`Height is ${finalHeight}`)
    textareaRef.current!.style.height = `${finalHeight}px`

    if (finalHeight > 3000) {
      // textareaRef.current!.style.height = '95vh'
      // setDisableHighlight(true)
    } else {
      // setDisableHighlight(false)
    }
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
      containerHeightRef.current = entries[0].contentRect.height
    })
    resizeObserverRef.current.observe(containerRef.current!)
    checkForRecalculate(textareaRef.current!.value)
  }, [])

  return (
    <div
      className={`
        ${s.container}
        ${disableHighlight ? s.disableHighlight : ''}
      `}
      ref={containerRef}
    >
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
      {!disableHighlight && (
        <div className={`font-monospace ${s.overlay}`}>
          {file.name?.endsWith('.xit') && (
            <XitOverlay value={value} />
          )}
          {(file.name?.endsWith('.md') || file.name?.endsWith('.gmi')) && (
            <MarkdownOverlay value={value} />
          )}
        </div>
      )}
    </div>
  )
}
