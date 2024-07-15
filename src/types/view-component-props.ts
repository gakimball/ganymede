import { FileEntry } from '@tauri-apps/api/fs';
import { Database, DatabaseRecord } from './database';
import { ViewConfig } from '../utils/view-config';

export interface ViewComponentProps {
  database: Database;
  config: ViewConfig;
  file: FileEntry;
  onSelectRecord: (record: DatabaseRecord) => void;
  directory: string;
}
