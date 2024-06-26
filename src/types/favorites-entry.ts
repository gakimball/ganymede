import { FileEntry } from '@tauri-apps/api/fs';
import { ViewConfig } from './view-config';

export interface FavoritesEntry {
  file: FileEntry;
  isBrokenFile: boolean;
  isBrokenView: boolean;
  view?: ViewConfig;
}
