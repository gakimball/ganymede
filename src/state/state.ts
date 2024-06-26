import { computed, effect, signal } from '@preact/signals'
import { createEmptyDatabase } from '../utils/create-empty-database'
import { readDir, readTextFile, type FileEntry } from '@tauri-apps/api/fs'
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseRecord } from '../types/database';
import { DIRECTORY_LOCALSTORAGE_KEY, LAST_VIEWED_LOCALSTORAGE_KEY } from '../utils/constants';
import { parseRecfile } from '../utils/parse-recfile';
import { open } from '@tauri-apps/api/dialog';
import autoBind from 'auto-bind';
import { FavoritesEntry } from '../types/favorites-entry';

type CurrentView = DatabaseView | TextView

interface DatabaseView {
  type: 'database';
  file: FileEntry;
  view: ViewConfig | null;
  database: Database;
}

interface TextView {
  type: 'text',
  file: FileEntry;
  contents: string;
}

type PersistedView =
  | Omit<DatabaseView, 'database'>
  | Omit<TextView, 'contents'>

export class State {
  directory = localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? '';

  readonly files =  signal<FileEntry[]>([]);
  readonly views =  signal(createEmptyDatabase());
  readonly favorites = signal<FavoritesEntry[]>([])
  readonly currentView =  signal<CurrentView | null>(null);
  readonly currentRecord =  signal<DatabaseRecord | null>(null);

  readonly viewsList = computed((): ViewConfig[] => {
    return this.views.value.records as unknown as ViewConfig[]
  })

  readonly viewsForCurrentFile = computed((): ViewConfig[] => {
    const file = this.currentView.value?.file
    return this.viewsList.value.filter(view => view.File === file?.name)
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
      }
    } else {
      persistedView = {
        type: 'text',
        file: currentView.file,
      }
    }

    localStorage.setItem(LAST_VIEWED_LOCALSTORAGE_KEY, JSON.stringify(persistedView))
  })

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
    })
    if (typeof selected === 'string') {
      await this.loadDirectory(selected)
    }
  }

  private async loadDirectory(path: string): Promise<void> {
    this.directory = path
    localStorage.setItem(DIRECTORY_LOCALSTORAGE_KEY, path)

    const files = await readDir(path)
    const configFile = files.find(file => file.name === '_views.rec')
    const favoritesFile = files.find(file => file.name === '_favorites.rec')

    this.setFiles(
      files.filter(file => file !== configFile && file !== favoritesFile)
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

  async openFile(file: FileEntry): Promise<void> {
    const fileContents = await readTextFile(file.path)

    if (file.path.endsWith('.rec')) {
      this.currentView.value = {
        type: 'database',
        file,
        view: this.viewsList.value.find(view => view.File === file?.name) ?? null,
        database: parseRecfile(fileContents)
      }
    } else {
      this.currentView.value = {
        type: 'text',
        file,
        contents: fileContents,
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
    if (this.directory) {
      this.loadDirectory(this.directory)
    }

    this.getLastViewed()
  }

  openRecord(record: DatabaseRecord): void {
    this.currentRecord.value = record
  }

  closeRecord(): void {
    this.currentRecord.value = null
  }

  updateRecord(original: DatabaseRecord, update: DatabaseRecord): void {
    Object.assign(original, update)
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
}
