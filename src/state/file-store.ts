import { computed, signal } from '@preact/signals';
import { FileEntry, readDir, readTextFile, removeDir, removeFile, renameFile, writeFile } from '@tauri-apps/api/fs';
import { DIRECTORY_LOCALSTORAGE_KEY } from '../utils/constants';
import { FavoritesEntry } from '../types/favorites-entry';
import { confirm, open } from '@tauri-apps/api/dialog';
import { queryRecfile } from '../utils/query-recfile';
import { getOrCreateConfigFile } from '../utils/get-or-create-config-file';
import { FeatherIconNames } from 'feather-icons';
import { recdel } from '../utils/recdel';
import { recins } from '../utils/recins';
import { RecutilsSelector } from '../types/recutils';
import { createPlaceholderViewConfig } from '../utils/create-placeholder-view-config';

export type CurrentFile = DatabaseFile | TextFile | Folder

export interface DatabaseFile {
  type: 'database';
  file: FileEntry;
  hasError: boolean;
}

export interface TextFile {
  type: 'text';
  file: FileEntry;
  contents: string;
  hasError: boolean;
}

export interface Folder {
  type: 'folder';
  file: FileEntry;
  hasError: boolean;
}

export class FileStore {
  readonly directory = signal(
    localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? ''
  );
  readonly files = signal<FileEntry[]>([]);
  readonly favorites = signal<FavoritesEntry[]>([])
  readonly current = signal<CurrentFile | null>(null);
  readonly configFile = signal<FileEntry | null>(null)
  readonly fileIcons = signal<Record<string, FeatherIconNames | undefined>>({});

  readonly sortedFiles = computed((): FileEntry[] => {
    return [...this.files.value].sort((a, b) => a.name!.localeCompare(b.name!))
  })

  readonly flatFiles = computed(() => {
    const mapFile = (file: FileEntry): FileEntry[] => {
      if (file.children) {
        return [file, ...file.children.flatMap(mapFile)]
      }
      return [file]
    }

    return this.files.value.flatMap(mapFile)
  })

  readonly directoryBase = computed((): string => {
    const segments = this.directory.value.split('/')

    return segments[segments.length - 1] ?? ''
  })

  setFiles(files: FileEntry[]): void {
    this.files.value = files
  }

  async createFile(path: string): Promise<void> {
    await writeFile(path, '')
    await this.reloadDirectory()
    await this.openFileByPath(path)
  }

  async openFileByPath(path: string): Promise<void> {
    const file = this.flatFiles.value.find(file => file.path === path)
    if (file) await this.openFile(file)
  }

  async openFile(file: FileEntry): Promise<void> {
    if (file.children) {
      this.current.value = {
        type: 'folder',
        file,
        hasError: false,
      }
    } else {
      let fileContents
      let hasError = false

      try {
        fileContents = await readTextFile(file.path)
      } catch {
        fileContents = ''
        hasError = true
      }

      if (file.path.endsWith('.rec')) {
        this.current.value = {
          type: 'database',
          file,
          hasError,
        }
      } else {
        this.current.value = {
          type: 'text',
          file,
          contents: fileContents,
          hasError,
        }
      }
    }
  }

  async renameFile(file: FileEntry, newName: string): Promise<void> {
    await renameFile(file.path, newName)
    this.reloadDirectory()
  }

  async deleteFile(file: FileEntry): Promise<void> {
    const addendum = file.children ? ' and its contents?' : ''
    const confirmed = await confirm(`Are you sure you want to delete ${file.name}${addendum}?`, {
      okLabel: 'Delete',
      type: 'warning',
    })

    if (confirmed) {
      if (file.children) {
        removeDir(file.path, {
          recursive: true,
        })
      } else {
        removeFile(file.path)
        this.reloadDirectory()
      }
    }
  }

  async openDirectoryPicker(): Promise<void> {
    const selected = await open({
      directory: true,
      recursive: true,
    })
    if (typeof selected === 'string') {
      await this.loadDirectory(selected)
    }
  }

  async changeFileIcon(file: FileEntry, icon: string | null): Promise<void> {
    const configFile = this.configFile.value
    if (!configFile) return

    const iconIsSet = file.name! in this.fileIcons.value
    const selector: RecutilsSelector = {
      type: 'File_icon',
      selector: iconIsSet ? `File = "${file.name}"` : undefined
    }

    if (icon === null) {
      await recdel(configFile.path, selector)
    } else {
      await recins(configFile.path, selector, {
        File: [file.name!],
        Icon: [icon],
      })
    }

    this.reloadDirectory()
  }

  private async loadDirectory(path: string): Promise<void> {
    this.directory.value = path
    localStorage.setItem(DIRECTORY_LOCALSTORAGE_KEY, path)

    const files = await readDir(path, {
      recursive: true,
    })
    const configFile = await getOrCreateConfigFile(files, path)

    this.setFiles(
      files.filter(file => file !== configFile && file !== configFile && !file.name?.startsWith('.'))
    )

    if (configFile) {
      this.configFile.value = configFile
    }

    if (configFile) {
      this.loadFavorites(configFile)
      this.loadFileIcons(configFile)
    }
  }

  async reloadDirectory(): Promise<void> {
    if (this.directory.value) {
      await this.loadDirectory(this.directory.value)
    }
  }

  private async loadFavorites(configFile: FileEntry): Promise<void> {
    const favoritesDb = await queryRecfile(configFile.path, {
      ...createPlaceholderViewConfig(),
      name: 'Favorites',
      file: '_ganymede.rec',
      layout: 'Text',
      type: 'Favorite',
    })

    this.favorites.value = favoritesDb.records.map((record): FavoritesEntry => {
      const fileName = record.File![0]
      const matchingFile = this.files.value.find(file => file.name === fileName)

      return {
        file: matchingFile ?? {
          path: fileName,
          name: fileName,
        },
        isBroken: !matchingFile,
      }
    })
  }

  private async loadFileIcons(configFile: FileEntry): Promise<void> {
    const iconsDb = await queryRecfile(configFile.path, {
      ...createPlaceholderViewConfig(),
      name: 'Icons',
      file: '_ganymede.rec',
      layout: 'Text',
      type: 'File_Icon',
    })

    const map: Record<string, FeatherIconNames> = {}
    iconsDb.records.forEach(record => {
      if (record.File && record.Icon) {
        map[record.File[0]] = record.Icon[0] as FeatherIconNames
      }
    })
    this.fileIcons.value = map
  }
}
