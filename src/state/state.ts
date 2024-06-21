import { computed, signal } from '@preact/signals'
import { createEmptyDatabase } from '../utils/create-empty-database'
import { readDir, readTextFile, type FileEntry } from '@tauri-apps/api/fs'
import bindMethods from 'bind-methods'
import { ViewConfig } from '../types/view-config';
import { Database } from '../types/database';
import { DIRECTORY_LOCALSTORAGE_KEY } from '../utils/constants';
import { parseRecfile } from '../utils/parse-recfile';
import { open } from '@tauri-apps/api/dialog';

interface CurrentView {
  file: FileEntry;
  view: ViewConfig;
  database: Database;
}

export const createState = () => {
  const state = {
    directory: localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? '',
    files: signal<FileEntry[]>([]),
    views: signal(createEmptyDatabase()),
    currentView: signal<CurrentView | null>(null),
  }

  const store = {
    ...state,

    viewsList: computed(() => {
      return state.views.value.records as unknown as ViewConfig[]
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

    async loadView(file: FileEntry, view: ViewConfig): Promise<void> {
      const fileContents = await readTextFile(file.path)

      this.currentView.value = {
        file,
        view,
        database: parseRecfile(fileContents)
      }
    },

    initialize() {
      if (this.directory) {
        this.loadDirectory(this.directory)
      }
    },
  }

  bindMethods(store)

  return store
}
