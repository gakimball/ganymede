import { FunctionComponent } from 'preact';

export const Pane: FunctionComponent = ({
  children,
}) => {
  return (
    <div
      className={`
        bg-background
        border-1 border-border rounded-lg
        p-3
      `}
    >
      {children}
    </div>
  )
}
