import { FileEntry } from '@tauri-apps/api/fs';
import { Fragment, FunctionComponent } from 'preact';
import { useMemoAsync } from '../../utils/use-memo-async';
import { join } from '@tauri-apps/api/path';
import { Link } from './link';
import { Database, DatabaseRecord } from '../../types/database';
import { CREATE_NEW_RECORD } from '../../state/app-store';
import { Route } from '../../state/router-state';

interface FileBreadcrumbsProps {
  directory: string;
  file: FileEntry;
  database: Database | undefined;
  record: DatabaseRecord | typeof CREATE_NEW_RECORD | null;
}

export const FileBreadcrumbs: FunctionComponent<FileBreadcrumbsProps> = ({
  directory,
  file,
  database,
  record,
}) => {
  const fileIsDirectory = !!file.children
  const pathSegments = useMemoAsync(
    async () => {
      const segments = file.path
        .replace(directory, '')
        .split('/')
        .slice(1) // The first path segment will be an empty string

      const paths = await Promise.all(segments.map(async (segment, index, arr): Promise<{
        title: string;
        route: Route | null;
      }> => ({
        title: segment,
        route: {
          name: 'file',
          path: await join(directory, ...arr.slice(0, index + 1)),
          view: null,
        },
      })))

      // if (database && record) {
      //   let title
      //   if (record === CREATE_NEW_RECORD) {
      //     title = 'New'
      //   } else if (database.key) {
      //     title = record[database.key]?.[0]
      //   }

      //   paths.push({
      //     title: title ?? 'Record',
      //     route: null,
      //   })
      // }

      return paths
    },
    [database, directory, file, record]
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
      {pathSegments?.map(({ title, route }, index, arr) => (
        <Fragment key={title}>
          <Link
            className="hover:underline truncate"
            route={route}
          >
            {title}
          </Link>
          {(index < arr.length - 1 || fileIsDirectory) && (
            <span>/</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
