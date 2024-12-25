import { FileEntry } from '@tauri-apps/api/fs'
import { Fragment, FunctionalComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { FileBrowserAction, FileBrowserItem } from './file-browser-item';
import { FileIconMap } from '../../types/icon-map';
import { useEventHandler } from '../../hooks/use-event-handler';
import { swapArrayValue } from '../../utils/swap-array-value';

interface FileTreeProps {
  disabledFiles?: FileEntry[];
  files: FileEntry[];
  fileIcons: FileIconMap;
  highlightedFiles?: FileEntry[];
  indent?: number;
  sortFiles?: (a: FileEntry, b: FileEntry) => number;
  onAction: (file: FileEntry, action: FileBrowserAction) => void;
}

export const FileTree: FunctionalComponent<FileTreeProps> = ({
  files,
  indent = 0,
  onAction,
  ...props
}) => {
  const {
    fileIcons,
    disabledFiles = [],
    highlightedFiles = [],
    sortFiles,
  } = props
  const sortedFiles = useMemo(() => {
    if (!sortFiles) {
      return files
    }

    return [...files].sort(sortFiles)
  }, [files, sortFiles])
  const [expandedDirs, setExpandedDirs] = useState<string[]>([])

  const handleAction = useEventHandler((file: FileEntry, action: FileBrowserAction) => {
    if (action === 'toggle') {
      setExpandedDirs(prev => swapArrayValue(prev, file.path))
    } else {
      onAction(file, action)
    }
  })

  useEffect(() => {
    setExpandedDirs([])
  }, [files])

  return (
    <>
      {sortedFiles.map(file => {
        const isDir = file.children !== undefined
        const isExpanded = expandedDirs.includes(file.path)
        const isDisabled = disabledFiles.includes(file)

        return (
          <Fragment key={file.path}>
            <FileBrowserItem
              file={file}
              isActive={highlightedFiles.includes(file)}
              isDisabled={isDisabled}
              indent={indent}
              onAction={handleAction}
              isExpandable={isDir}
              isExpanded={isExpanded}
              fileIconMap={fileIcons}
            />
            {isDir && isExpanded && (
              <FileTree
                {...props}
                files={file.children ?? []}
                indent={indent + 1}
                onAction={handleAction}
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}
