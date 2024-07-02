import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { ViewComponentProps } from '../../types/view-component-props'
import { readTextFile } from '@tauri-apps/api/fs'
import { TextEditor } from '../common/text-editor'

export const TextView: FunctionComponent<ViewComponentProps> = ({
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
    <TextEditor
      key={contents.length}
      file={file}
      contents={contents}
    />
  )
}
