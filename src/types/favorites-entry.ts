import { FileEntry } from '@tauri-apps/api/fs';
import { ViewConfig } from './view-config';

export interface FavoritesEntry {
  file: FileEntry;
  isBroken: boolean;
}
