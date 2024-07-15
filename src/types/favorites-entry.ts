import { FileEntry } from '@tauri-apps/api/fs';
import { ViewConfig } from '../utils/view-config';

export interface FavoritesEntry {
  file: FileEntry;
  isBroken: boolean;
}
