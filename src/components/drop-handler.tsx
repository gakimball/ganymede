import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks'

interface DropHandlerProps {
  onDroppedFile: (file: File) => void;
}

export const DropHandler: FunctionComponent<DropHandlerProps> = ({
  children,
  onDroppedFile,
}) => {
  const handleDrop = useCallback((event: DragEvent) => {
    event.preventDefault()
    const item = event.dataTransfer?.items[0]
    const file = item?.getAsFile()
    if (file) onDroppedFile(file)
  }, [])

  return (
    <div
      className="h-100"
      onDrop={handleDrop}
      onDragOver={event => event.preventDefault()}
    >
      {children}
    </div>
  )
}
