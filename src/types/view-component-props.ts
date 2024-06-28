import { FileEntry } from '@tauri-apps/api/fs';
import { Database, DatabaseRecord } from './database';
import { ViewConfig } from './view-config';

export interface ViewComponentProps extends Database {
  config: ViewConfig;
  file: FileEntry;
  onSelectRecord: (record: DatabaseRecord) => void;
  directory: string;
}
