import { FunctionComponent } from 'preact';
import s from './container.module.css'

export const Container: FunctionComponent = ({
  children,
}) => {
  return (
    <div className={`${s.container} container-fluid py-3`}>
      {children}
    </div>
  )
}
