import { Signal, batch, computed, effect, signal } from '@preact/signals';
import { createEmptyDatabase } from '../utils/create-empty-database';
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseRecord } from '../types/database';
import { CREATE_NEW_RECORD } from './app-store';
import { DATABASE_CHANGE_EVENT } from '../utils/constants';
import { Command } from '@tauri-apps/api/shell';
import { createEmptyRecord } from '../utils/create-empty-record';
import { CurrentFile } from './file-store';
import { confirm } from '@tauri-apps/api/dialog';
import { FileEntry, readTextFile } from '@tauri-apps/api/fs';
import { parseRecfile } from '../utils/parse-recfile';
import { when } from '../utils/when-signal';

export class ViewStore {
  private readonly views = signal(createEmptyDatabase());
  readonly current = signal<ViewConfig | null>(null);
  readonly editing = signal<DatabaseRecord | typeof CREATE_NEW_RECORD | null>(null);
  readonly loadingViews = signal(true)

  readonly list = computed((): ViewConfig[] => {
    return this.views.value.records as unknown as ViewConfig[]
  })

  constructor(
    private readonly currentFile: Signal<CurrentFile | null>,
    viewsFile: Signal<FileEntry | null>
  ) {
    effect(() => {
      const file = viewsFile.value

      if (file) {
        readTextFile(file.path).then((contents) => {
          batch(() => {
            this.views.value = parseRecfile(contents)
            this.loadingViews.value = false
          })
        })
      }
    })
  }

  setViews(database: Database): void {
    this.views.value = database
  }

  openView(view: ViewConfig): void {
    this.current.value = view
  }

  openViewByName(file: FileEntry, viewName: string): void {
    if (viewName === 'Text') {
      this.openView({
        Name: 'Text',
        Layout: 'Text',
        File: file?.name ?? '',
      })
    } else {
      const view = this.list.value
        .find(view => view.File === file.name && view.Name === viewName)

      if (view) this.openView(view)
    }
  }

  openDefaultViewForFile(file: FileEntry) {
    const view = this.list.value
      .find(view => view.File === file.name)
      ?? {
        Name: 'Text',
        Layout: 'Text',
        File: file.name ?? '',
      }

    this.openView(view)
  }

  openEditRecord(record: DatabaseRecord): void {
    this.editing.value = record
  }

  openCreateRecord(): void {
    this.editing.value = CREATE_NEW_RECORD
  }

  closeEditor(): void {
    this.editing.value = null
  }

  async createRecord(record: DatabaseRecord): Promise<void> {
    const currentFile = this.currentFile.value

    if (currentFile?.type !== 'database') {
      return
    }

    const { records, fields } = currentFile.database
    const dbPath = currentFile.file.path

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
      records.push(newRecord)
    }

    this.closeEditor()
  }

  async updateRecord(original: DatabaseRecord, update: DatabaseRecord): Promise<void> {
    const currentFile = this.currentFile.value

    if (currentFile?.type !== 'database') {
      return
    }

    const { records } = currentFile.database
    const dbPath = currentFile.file.path
    const index = records.indexOf(original)

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

    this.closeEditor()
  }

  async deleteRecord(record: DatabaseRecord): Promise<void> {
    const confirmed = await confirm('Delete this record?', {
      okLabel: 'Delete',
      type: 'warning',
    })

    if (!confirmed) {
      return
    }

    const currentFile = this.currentFile.value

    if (currentFile?.type !== 'database') {
      return
    }

    const { records } = currentFile.database
    const dbPath = currentFile.file.path
    const index = records.indexOf(record)

    if (index > -1 && dbPath) {
      const cmd = new Command('recdel', [
        '-n',
        String(index),
        dbPath,
      ])

      await cmd.execute()
      records.splice(index, 1)
      this.signalDatabaseChange()
    }

    this.closeEditor()
  }

  private signalDatabaseChange(): void {
    const event = new CustomEvent(DATABASE_CHANGE_EVENT)
    window.dispatchEvent(event)
  }
}