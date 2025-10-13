import { FunctionComponent } from 'preact';
import { Route } from '../../state/router-state'
import { useStore } from '../../state/use-store';
import { useEventHandler } from '../../hooks/use-event-handler';
import { HTMLAttributes } from 'preact/compat';
import { navigate } from '../../state/router-state';

interface LinkProps extends HTMLAttributes<HTMLButtonElement> {
  route: Route | null;
}

export const Link: FunctionComponent<LinkProps> = ({
  children,
  route,
  ...props
}) => {
  const { router } = useStore()

  const handleClick = useEventHandler((event: any) => {
    if (route) {
      navigate(router, route)
    } else {
      props.onClick?.(event)
    }
  })

  return (
    <button
      {...props}
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
