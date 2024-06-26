import { computed, signal } from '@preact/signals'
import { createEmptyDatabase } from '../utils/create-empty-database'
import { readDir, readTextFile, type FileEntry } from '@tauri-apps/api/fs'
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseRecord } from '../types/database';
import { DIRECTORY_LOCALSTORAGE_KEY } from '../utils/constants';
import { parseRecfile } from '../utils/parse-recfile';
import { open } from '@tauri-apps/api/dialog';
import autoBind from 'auto-bind';

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

export class State {
  private directory =  localStorage.getItem(DIRECTORY_LOCALSTORAGE_KEY) ?? '';

  readonly files =  signal<FileEntry[]>([]);
  readonly views =  signal(createEmptyDatabase());
  readonly currentView =  signal<CurrentView | null>(null);
  readonly currentRecord =  signal<DatabaseRecord | null>(null);

  readonly viewsList = computed((): ViewConfig[] => {
    return this.views.value.records as unknown as ViewConfig[]
  })

  readonly viewsForCurrentFile = computed((): ViewConfig[] => {
    const file = this.currentView.value?.file
    return this.viewsList.value.filter(view => view.File === file?.name)
  })

  constructor() {
    autoBind(this)
  }

  setFiles(files: FileEntry[]): void {
    this.files.value = files
  }

  setViews(database: Database): void {
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

  initialize() {
    if (this.directory) {
      this.loadDirectory(this.directory)
    }
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
}
