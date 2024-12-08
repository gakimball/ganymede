import { FunctionComponent, } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { useStore } from '../../state/use-store';
import { Route } from '../../state/router-store';

interface RouteHandlerProps {
  children: (route: Route) => JSX.Element;
}

export const RouteHandler: FunctionComponent<RouteHandlerProps> = ({
  children,
}) => {
  const { router } = useStore()

  return children(router.current.value)
}
