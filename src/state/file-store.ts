import { computed, signal } from '@preact/signals';
import { FileEntry, readDir, readTextFile, removeDir, removeFile, renameFile, writeFile } from '@tauri-apps/api/fs';
import { DIRECTORY_LOCALSTORAGE_KEY } from '../utils/constants';
import { FavoritesEntry } from '../types/favorites-entry';
import { confirm, open } from '@tauri-apps/api/dialog';
import { queryRecfile } from '../utils/query-recfile';
import { normalize } from '@tauri-apps/api/path';

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
  readonly viewsFile = signal<FileEntry | null>(null)

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

  private async loadDirectory(path: string): Promise<void> {
    this.directory.value = path
    localStorage.setItem(DIRECTORY_LOCALSTORAGE_KEY, path)

    const files = await readDir(path, {
      recursive: true,
    })
    const configFile = files.find(file => file.name === '_views.rec')
    const favoritesFile = files.find(file => file.name === '_favorites.rec')

    this.setFiles(
      files.filter(file => file !== configFile && file !== favoritesFile && !file.name?.startsWith('.'))
    )

    if (configFile) {
      this.viewsFile.value = configFile
    }

    if (favoritesFile) {
      const favoritesDb = await queryRecfile(favoritesFile.path)

      this.favorites.value = favoritesDb.records.map((record): FavoritesEntry => {
        const fileName = record.File as string
        const matchingFile = files.find(file => file.name === fileName)

        return {
          file: matchingFile ?? {
            path: fileName,
            name: fileName,
          },
          isBroken: !matchingFile,
        }
      })
    }
  }

  async reloadDirectory(): Promise<void> {
    if (this.directory.value) {
      await this.loadDirectory(this.directory.value)
    }
  }
}
