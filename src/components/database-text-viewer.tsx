import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { ViewComponentProps } from '../types/view-component-props'
import { readTextFile } from '@tauri-apps/api/fs'
import s from './database-text-viewer.module.css'

export const DatabaseTextViewer: FunctionComponent<ViewComponentProps> = ({
  file,
}) => {
  const [contents, setContents] = useState('')
  const filePath = file.path

  const loadFile = useCallback(async () => {
    setContents(await readTextFile(filePath))
  }, [filePath])

  useEffect(() => {
    loadFile()
  }, [loadFile])

  return (
    <textarea
      className={`form-control font-monospace border-0 ${s.textarea}`}
      defaultValue={contents}
      rows={10}
    />
  )
}
