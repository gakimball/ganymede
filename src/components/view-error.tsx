import { memo } from 'preact/compat';

export const ViewError = memo(() => (
  <div className="h-full flex items-center justify-center pt-12">
    <p>
      Error loading this file. It might be a binary format.
    </p>
  </div>
))
