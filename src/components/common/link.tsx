import { FunctionComponent } from 'preact';
import { Route } from '../../state/router-store'
import { useStore } from '../../state/use-store';
import { useEventHandler } from '../../hooks/use-event-handler';
import { HTMLAttributes } from 'preact/compat';

interface LinkProps extends HTMLAttributes<HTMLButtonElement> {
  route: Route | null;
}

export const Link: FunctionComponent<LinkProps> = ({
  children,
  route,
  ...props
}) => {
  const { router } = useStore()

  const handleClick = useEventHandler(() => {
    if (route) router.navigate(route)
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
