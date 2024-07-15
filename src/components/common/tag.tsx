import { FunctionComponent } from 'preact';

interface TagProps {
  color: string;
}

export const Tag: FunctionComponent<TagProps> = ({
  children,
  color,
}) => (
  <span
    className="py-1 px-2 rounded-md text-sm text-content bg-[--EnumTag-color]"
    style={{
      '--EnumTag-color': color,
    }}
  >
    {children}
  </span>
)
