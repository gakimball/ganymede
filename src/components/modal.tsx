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
        fixed inset-0 z-10
        flex items-center justify-center
      `}
    >
      <div
        className={`
          bg-background
          p-3
          border-1 border-border rounded-xl
          overflow-y-auto
        `}
        style={{
          width,
          height,
        }}
      >
        {children}
      </div>
    </div>
  )
}
