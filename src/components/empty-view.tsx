import { memo } from 'preact/compat';
import img from '../assets/placeholder.png'

export const EmptyView = memo(() => (
  <div className="flex items-center justify-center h-screen">
    <img src={img} />
  </div>
))
