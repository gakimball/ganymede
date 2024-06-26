import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { ViewComponentProps } from '../types/view-component-props'
import { readTextFile } from '@tauri-apps/api/fs'
import s from './database-text-viewer.module.css'

export const DatabaseTextViewer: FunctionComponent<ViewComponentProps> = ({
  config,
  directory,
}) => {
  const [contents, setContents] = useState('')
  const fileName = directory + '/' + config.File

  const loadFile = useCallback(async () => {
    setContents(await readTextFile(fileName))
  }, [fileName])

  useEffect(() => {
    loadFile()
  }, [loadFile])

  return (
    <textarea
      className={`form-control font-monospace border-0 ${s.textarea}`}
      defaultValue={contents}
      rows={12}
    />
  )
}
