import { memo } from 'preact/compat';
import { TextEditor } from '../common/text-editor';
import { TextFile } from '../../state/file-store';

export const TextLayout = memo<TextFile>(({
  file,
  contents,
}) => {
  return (
    <TextEditor
      key={file.path}
      file={file}
      contents={contents}
    />
  )
})
