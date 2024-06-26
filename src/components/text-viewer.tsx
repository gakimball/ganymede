import { FunctionComponent } from 'preact';
import s from './text-viewer.module.css'

interface TextViewerProps {
  contents: string;
}

export const TextViewer: FunctionComponent<TextViewerProps> = ({
  contents,
}) => {
  return (
    <textarea
      className={`form-control font-monospace border-0 ${s.textarea}`}
      defaultValue={contents}
      rows={12}
    ></textarea>
  )
}
