import { computed, effect, signal } from '@preact/signals'
import { createEmptyDatabase } from '../utils/create-empty-database'
import { readDir, readTextFile, removeDir, removeFile, renameFile, type FileEntry } from '@tauri-apps/api/fs'
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseFieldMap, DatabaseRecord } from '../types/database';
import { DATABASE_CHANGE_EVENT, DIRECTORY_LOCALSTORAGE_KEY, LAST_VIEWED_LOCALSTORAGE_KEY } from '../utils/constants';
import { parseRecfile } from '../utils/parse-recfile';
import { confirm, open } from '@tauri-apps/api/dialog';
import autoBind from 'auto-bind';
import { FavoritesEntry } from '../types/favorites-entry';
import { Command } from '@tauri-apps/api/shell';
import { createEmptyRecord } from '../utils/create-empty-record';

type CurrentView = DatabaseView | TextView | FolderView

interface DatabaseView {
  type: 'database';
  file: FileEntry;
  view: ViewConfig | null;
  database: Database;
  hasError: boolean;
}

interface TextView {
  type: 'text';
  file: FileEntry;
  contents: string;
  hasError: boolean;
}

interface FolderView {
  type: 'folder';
  file: FileEntry;
  hasError: boolean;
}

type PersistedView =
  | Omit<DatabaseView, 'database'>
  | Omit<TextView, 'contents'>
  | Omit<FolderView, 'contents'>

export const CREATE_NEW_RECORD = Symbol('CREATE_NEW_RECORD')

export interface PromptPayload {
  text: string;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
}

export class AppStore {
  readonly directory = signal(
    localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? ''
  );
  readonly files =  signal<FileEntry[]>([]);
  readonly views =  signal(createEmptyDatabase());
  readonly favorites = signal<FavoritesEntry[]>([])
  readonly currentView =  signal<CurrentView | null>(null);
  readonly currentRecord = signal<DatabaseRecord | typeof CREATE_NEW_RECORD | null>(null);
  readonly quickFindOpen = signal(false);
  readonly currentPrompt = signal<PromptPayload | null>(null)

  private promptResolver?: (value: string | null) => void;

  readonly directoryBase = computed((): string => {
    const segments = this.directory.value.split('/')

    return segments[segments.length - 1] ?? ''
  })

  readonly viewsList = computed((): ViewConfig[] => {
    return this.views.value.records as unknown as ViewConfig[]
  })

  readonly viewsForCurrentFile = computed((): ViewConfig[] => {
    const file = this.currentView.value?.file
    return this.viewsList.value.filter(view => view.File === file?.name)
  })

  readonly sortedFiles = computed((): FileEntry[] => {
    return [...this.files.value].sort((a, b) => a.name!.localeCompare(b.name!))
  })

  readonly currentViewType = computed(() => {
    return this.currentView.value?.type
  })

  readonly currentViewHasError = computed(() => {
    return this.currentView.value?.hasError ?? false
  })

  private readonly persistCurrentView = effect(() => {
    const currentView = this.currentView.value

    if (!currentView) {
      localStorage.removeItem(LAST_VIEWED_LOCALSTORAGE_KEY)
      return
    }

    let persistedView: PersistedView

    if (currentView.type === 'database') {
      persistedView = {
        type: 'database',
        file: currentView.file,
        view: currentView.view,
        hasError: false,
      }
    } else {
      persistedView = {
        type: 'text',
        file: currentView.file,
        hasError: false,
      }
    }

    localStorage.setItem(LAST_VIEWED_LOCALSTORAGE_KEY, JSON.stringify(persistedView))
  })

  private get currentViewRecords(): DatabaseRecord[] {
    const view = this.currentView.value

    if (view?.type === 'database') {
      return view.database.records
    }

    return []
  }

  private get currentViewFields(): DatabaseFieldMap {
    const view = this.currentView.value

    if (view?.type === 'database') {
      return view.database.fields
    }

    return new Map()
  }

  constructor() {
    autoBind(this)
  }

  private setFiles(files: FileEntry[]): void {
    this.files.value = files
  }

  private setViews(database: Database): void {
    this.views.value = database
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
      const configFileContents = await readTextFile(configFile.path)
      this.setViews(parseRecfile(configFileContents))
    }

    if (favoritesFile) {
      const favoritesDb = parseRecfile(await readTextFile(favoritesFile.path))
      const favorites = favoritesDb.records.map((record): FavoritesEntry => {
        const fileName = record.File as string
        const viewName = record.View
        const matchingFile = files.find(file => file.name === fileName)
        const matchingView = this.viewsList.value.find(view => {
          return view.File === matchingFile?.name && view.Name === viewName
        })

        return {
          file: matchingFile ?? {
            path: fileName,
            name: fileName,
          },
          view: matchingView,
          isBrokenFile: !matchingFile,
          isBrokenView: viewName !== undefined && !matchingView,
        }
      })

      this.favorites.value = favorites
    }
  }

  async reloadDirectory(): Promise<void> {
    if (this.directory) {
      this.currentView.value = null
      await this.loadDirectory(this.directory.value)
    }
  }

  async openFile(file: FileEntry): Promise<void> {
    let fileContents
    let hasError = false

    if (file.children) {
      this.currentView.value = {
        type: 'folder',
        file,
        hasError: false,
      }
      return
    }

    try {
      fileContents = await readTextFile(file.path)
    } catch {
      fileContents = ''
      hasError = true
    }

    if (file.path.endsWith('.rec')) {
      this.currentView.value = {
        type: 'database',
        file,
        view: this.viewsList.value.find(view => view.File === file?.name) ?? null,
        database: parseRecfile(fileContents),
        hasError,
      }
    } else {
      this.currentView.value = {
        type: 'text',
        file,
        contents: fileContents,
        hasError,
      }
    }
  }

  openView(view: ViewConfig): void {
    const currentView = this.currentView.value

    if (currentView?.type === 'database') {
      this.currentView.value = {
        ...currentView,
        view,
      }
    }
  }

  initialize(): void {
    if (this.directory.value) {
      this.loadDirectory(this.directory.value)
    }

    this.getLastViewed()
  }

  openRecord(record: DatabaseRecord): void {
    this.currentRecord.value = record
  }

  openNewRecord(): void {
    this.currentRecord.value = CREATE_NEW_RECORD
  }

  closeRecord(): void {
    this.currentRecord.value = null
  }

  async createRecord(record: DatabaseRecord): Promise<void> {
    const allRecords = this.currentViewRecords
    const fields = this.currentViewFields
    const dbPath = this.currentView.value?.file.path

    if (dbPath) {
      const cmd = new Command('recins', [
        ...Object.entries(record).flatMap(([field, value]) => {
          if (!value) {
            return []
          }

          return ['-f', field, '-v', value]
        }),
        dbPath
      ])

      await cmd.execute()
      const newRecord = createEmptyRecord(fields)
      Object.assign(newRecord, record)
      allRecords.push(newRecord)
    }

    this.closeRecord()
  }

  async updateRecord(original: DatabaseRecord, update: DatabaseRecord): Promise<void> {
    const allRecords = this.currentViewRecords
    const index = allRecords.indexOf(original)
    const dbPath = this.currentView.value?.file.path

    if (index > -1 && dbPath) {
      const cmd = new Command('recins', [
        '-n',
        String(index),
        ...Object.entries(update).flatMap(([field, value]) => {
          if (!value) {
            return []
          }

          return ['-f', field, '-v', value]
        }),
        dbPath
      ])

      await cmd.execute()
      Object.assign(original, update)
      this.signalDatabaseChange()
    }

    this.closeRecord()
  }

  async deleteRecord(record: DatabaseRecord): Promise<void> {
    const confirmed = await confirm('Delete this record?', {
      okLabel: 'Delete',
      type: 'warning',
    })

    if (!confirmed) {
      return
    }

    const allRecords = this.currentViewRecords
    const index = allRecords.indexOf(record)
    const dbPath = this.currentView.value?.file.path

    if (index > -1 && dbPath) {
      const cmd = new Command('recdel', [
        '-n',
        String(index),
        dbPath,
      ])

      await cmd.execute()
      allRecords.splice(index, 1)
      this.signalDatabaseChange()
    }

    this.closeRecord()
  }

  getLastViewed(): void {
    const stored = localStorage.getItem(LAST_VIEWED_LOCALSTORAGE_KEY)

    if (stored) {
      const persistedView = JSON.parse(stored) as PersistedView
      this.openFile(persistedView.file)
      if (persistedView.type === 'database' && persistedView.view) {
        this.openView(persistedView.view)
      }
    }
  }

  async renameFile(file: FileEntry): Promise<void> {
    const newName = await this.prompt({
      text: 'Enter a new file name',
      defaultValue: file.path,
      submitText: 'Rename',
    })

    if (newName) {
      await renameFile(file.path, newName)
      this.reloadDirectory()
    }
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

  toggleQuickFind(): void {
    this.quickFindOpen.value = !this.quickFindOpen.value
  }

  private signalDatabaseChange(): void {
    const event = new CustomEvent(DATABASE_CHANGE_EVENT)
    window.dispatchEvent(event)
  }

  prompt(payload: PromptPayload): Promise<string | null> {
    this.currentPrompt.value = payload

    return new Promise<string | null>((resolve) => {
      // Resolve an existing Promise just in case
      this.promptResolver?.(null)
      this.promptResolver = resolve
    })
  }

  resolvePrompt(value: string | null): void {
    this.promptResolver?.(value)
    this.promptResolver = undefined
    this.currentPrompt.value = null
  }
}
