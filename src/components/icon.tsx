import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks'
import { FeatherIconNames, icons } from 'feather-icons'

interface IconProps {
  name: FeatherIconNames;
}

export const Icon = memo<IconProps>(({
  name,
}) => {
  const html = useMemo(() => icons[name].toSvg({
    width: 16, // @TODO Should reference Tailwind config value
    height: 16,
    class: 'size-icon align-top inline-block',
  }), [name, 16])

  return (
    <span
      className="align-top"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
})
