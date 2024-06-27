import { memo, useMemo } from 'preact/compat';
import { FeatherIconNames, icons } from 'feather-icons'
import s from './icon.module.css'

interface IconProps {
  name: FeatherIconNames;
  size?: number;
}

export const Icon = memo<IconProps>(({
  name,
  size = 16,
}) => {
  const html = useMemo(() => icons[name].toSvg({
    width: size,
    height: size,
    class: s.svg,
  }), [name, size])

  return (
    <span
      className={s.icon}
      style={{
        '--Icon-size': size,
      }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
})
