import { computed, signal } from '@preact/signals'
import { createEmptyDatabase } from '../utils/create-empty-database'
import { readDir, readTextFile, type FileEntry } from '@tauri-apps/api/fs'
import bindMethods from 'bind-methods'
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseRecord } from '../types/database';
import { DIRECTORY_LOCALSTORAGE_KEY } from '../utils/constants';
import { parseRecfile } from '../utils/parse-recfile';
import { open } from '@tauri-apps/api/dialog';

interface CurrentView {
  file: FileEntry;
  view: ViewConfig | null;
  database: Database;
}

export const createState = () => {
  const state = {
    directory: localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? '',
    files: signal<FileEntry[]>([]),
    views: signal(createEmptyDatabase()),
    currentView: signal<CurrentView | null>(null),
    currentRecord: signal<DatabaseRecord | null>(null),
  }

  const viewsList = computed((): ViewConfig[] => {
    return state.views.value.records as unknown as ViewConfig[]
  })

  const store = {
    ...state,

    viewsList,

    viewsForCurrentFile: computed((): ViewConfig[] => {
      const file = state.currentView.value?.file
      return viewsList.value.filter(view => view.File === file?.name)
    }),

    setFiles(files: FileEntry[]): void {
      this.files.value = files
    },

    setViews(database: Database): void {
      this.views.value = database
    },

    async openDirectoryPicker(): Promise<void> {
      const selected = await open({
        directory: true,
      })
      if (typeof selected === 'string') {
        await this.loadDirectory(selected)
      }
    },

    async loadDirectory(path: string): Promise<void> {
      this.directory = path
      localStorage.setItem(DIRECTORY_LOCALSTORAGE_KEY, path)

      const files = await readDir(path)
      const configFile = files.find(file => file.name === '_recdb.rec')

      this.setFiles(files)

      if (configFile) {
        const configFileContents = await readTextFile(configFile.path)
        this.setViews(parseRecfile(configFileContents))
      }
    },

    async openFile(file: FileEntry): Promise<void> {
      const fileContents = await readTextFile(file.path)

      this.currentView.value = {
        file,
        view: viewsList.value.find(view => view.File === file?.name) ?? null,
        database: parseRecfile(fileContents)
      }
    },

    openView(view: ViewConfig): void {
      const currentView = this.currentView.value

      if (currentView) {
        this.currentView.value = {
          ...currentView,
          view,
        }
      }
    },

    initialize() {
      if (this.directory) {
        this.loadDirectory(this.directory)
      }
    },

    openRecord(record: DatabaseRecord): void {
      this.currentRecord.value = record
    },

    closeRecord(): void {
      this.currentRecord.value = null
    },

    updateRecord(original: DatabaseRecord, update: DatabaseRecord): void {
      const records = this.currentView.value?.database.records
      const spliceIndex = records?.indexOf(original) ?? -1

      if (spliceIndex > -1) {
        records?.splice(spliceIndex, 1, update)
      }

      this.closeRecord()
    }
  }

  bindMethods(store)

  return store
}
