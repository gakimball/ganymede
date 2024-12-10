import { FileEntry } from '@tauri-apps/api/fs';
import { ViewConfig } from './view-config';

export const createTextView = (file: FileEntry): ViewConfig => ({
  name: 'Text',
  file: file.name ?? '',
  layout: 'Text',
  render: [],
  sum: [],
  fullPage: false,
  fields: null,
  filter: null,
  group: null,
  aggregate: null,
  sort: null,
  type: null,
})
