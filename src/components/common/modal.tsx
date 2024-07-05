import { FunctionComponent } from 'preact';

interface ModalProps {
  width?: string;
  height?: string;
}

export const Modal: FunctionComponent<ModalProps> = ({
  children,
  width,
  height,
}) => {
  return (
    <div
      className={`
        fixed inset-0 z-20
        flex items-center justify-center
        bg-background-overlay
      `}
    >
      <div
        className={`
          w-[--Modal-width] h-[--Modal-height] max-h-[90vh]
          bg-background
          p-3
          border-1 border-border rounded-xl
          overflow-y-auto
        `}
        style={{
          '--Modal-width': width,
          '--Modal-height': height,
        }}
      >
        {children}
      </div>
    </div>
  )
}
