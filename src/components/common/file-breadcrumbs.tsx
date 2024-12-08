import { FileEntry } from '@tauri-apps/api/fs';
import { Fragment, FunctionComponent } from 'preact';
import { useMemoAsync } from '../../utils/use-memo-async';
import { join } from '@tauri-apps/api/path';
import queryString from 'query-string';
import { ROUTES } from '../../utils/routes';
import { Link } from './link';

interface FileBreadcrumbsProps {
  directory: string;
  file: FileEntry;
}

export const FileBreadcrumbs: FunctionComponent<FileBreadcrumbsProps> = ({
  directory,
  file,
}) => {
  const fileIsDirectory = !!file.children
  const pathSegments = useMemoAsync(
    () => {
      const segments = file.path
        .replace(directory, '')
        .split('/')
        .slice(1) // The first path segment will be an empty string

      return Promise.all(segments.map(async (segment, index, arr) => ({
        href: await join(directory, ...arr.slice(0, index + 1)),
        label: segment,
      })))
    },
    [directory, file]
  )

  return (
    <div
      className={`
        sticky top-0 z-10
        flex items-center gap-2
        pt-3 pb-4 ps-4
        bg-background
        border-b-1 border-border
      `}
    >
      {/* Maintain container height even when empty */}
      {!pathSegments && (
        <>&nbsp;</>
      )}
      {pathSegments?.map(({ href, label }, index, arr) => (
        <Fragment key={href}>
          <Link
            className="hover:underline truncate"
            route={{
              name: 'file',
              path: href,
              view: null,
            }}
          >
            {label}
          </Link>
          {(index < arr.length - 1 || fileIsDirectory) && (
            <span>/</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
