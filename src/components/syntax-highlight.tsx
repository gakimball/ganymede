import { forwardRef } from 'preact/compat';
import { useImperativeHandle, useMemo, useRef } from 'preact/hooks'
import { useEventHandler } from '../hooks/use-event-handler';
import { syntaxHighlighters } from '../utils/syntax-highlighters';

interface SyntaxtHighlightProps {
  fileName: string;
}

export interface SyntaxHighlightRef {
  updateText: (value: string) => void;
}

export const SyntaxHighlight = forwardRef<SyntaxHighlightRef, SyntaxtHighlightProps>(({
  fileName,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const highlighter = useMemo(() => {
    if (fileName.endsWith('.md') || fileName.endsWith('.gmi')) {
      return syntaxHighlighters.markdown
    }
    if (fileName.endsWith('.xit')) {
      return syntaxHighlighters.xit
    }
    return syntaxHighlighters.plaintext
  }, [fileName])

  const updateText = useEventHandler((value: string) => {
    containerRef.current!.innerHTML = highlighter(value)
  })

  useImperativeHandle(ref, () => ({ updateText }))

  return <div ref={containerRef} />
})
