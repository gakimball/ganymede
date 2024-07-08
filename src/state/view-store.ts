import { Signal, computed, effect, signal } from '@preact/signals';
import { createEmptyDatabase } from '../utils/create-empty-database';
import { ViewConfig } from '../types/view-config';
import { Database, DatabaseFieldMap, DatabaseRecord } from '../types/database';
import { CREATE_NEW_RECORD } from './app-store';
import { Command } from '@tauri-apps/api/shell';
import { CurrentFile } from './file-store';
import { confirm } from '@tauri-apps/api/dialog';
import { FileEntry } from '@tauri-apps/api/fs';
import { queryRecfile } from '../utils/query-recfile';
import { recins } from '../utils/recins';
import { recdel } from '../utils/recdel';
import { ROUTES } from '../utils/routes';

interface CurrentView {
  config: ViewConfig;
  database: Database;
}

export class ViewStore {
  private readonly views = signal(createEmptyDatabase());
  readonly current = signal<CurrentView | null>(null);
  readonly editing = signal<DatabaseRecord | typeof CREATE_NEW_RECORD | null>(null);
  readonly loadingViews = signal(true)
  readonly editingView = signal(false)
  readonly creatingView = signal(false)

  readonly list = computed((): ViewConfig[] => {
    return this.views.value.records as unknown as ViewConfig[]
  })

  readonly fields = computed((): DatabaseFieldMap => this.views.value.fields)

  constructor(
    private readonly currentFile: Signal<CurrentFile | null>,
    private readonly viewsFile: Signal<FileEntry | null>
  ) {
    effect(() => {
      const file = viewsFile.value
      if (file) this.reloadViews(file.path)
    })
  }

  async reloadViews(dbPath: string): Promise<void> {
    this.views.value = await queryRecfile(dbPath)
    this.loadingViews.value = false
  }

  setViews(database: Database): void {
    this.views.value = database
  }

  async openView(view: ViewConfig): Promise<void> {
    const dbPath = this.currentFile.value?.file.path

    if (dbPath) {
      this.current.value = {
        config: view,
        database: await queryRecfile(dbPath, view),
      }
    }
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

  async createView(view: ViewConfig): Promise<void> {
    const dbPath = this.viewsFile.value?.path
    const file = this.currentFile.value?.file

    if (!dbPath || !file) return

    const views = this.views.value

    await recins(dbPath, views.type, undefined, view as unknown as DatabaseRecord)
    await this.reloadViews(dbPath)
    // x-ref: GNY-01
    history.replaceState(null, '', ROUTES.file(file.path, view))
    this.openViewByName(file, view.Name)
    this.toggleViewCreator()
  }

  async editCurrentView(changes: ViewConfig): Promise<void> {
    const current = this.current.value
    const dbPath = this.viewsFile.value?.path
    const file = this.currentFile.value?.file

    if (!current || !dbPath || !file) return

    const index = this.list.value.indexOf(current.config)

    if (index > -1) {
      await recins(dbPath, this.views.value.type, index, changes as unknown as DatabaseRecord)
      await this.reloadViews(dbPath)
      // x-ref: GNY-01
      history.replaceState(null, '', ROUTES.file(file.path, changes))
      this.openViewByName(file, changes.Name)
    }

    this.toggleViewEditor()
  }

  async deleteCurrentView(): Promise<void> {
    const confirmed = await confirm('Delete this view?', {
      okLabel: 'Delete',
      type: 'warning',
    })

    if (!confirmed) return

    const current = this.current.value
    const dbPath = this.viewsFile.value?.path
    const file = this.currentFile.value?.file

    if (!current || !dbPath || !file) return

    const index = this.list.value.indexOf(current.config)

    if (index > -1) {
      await recdel(dbPath, this.views.value.type, index)
      await this.reloadViews(dbPath)
      // x-ref: GNY-01
      history.replaceState(null, '', ROUTES.file(file.path))
      this.openDefaultViewForFile(file)
    }
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
    const dbPath = this.currentFile.value?.file.path

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
    }

    this.closeEditor()
  }

  async updateRecord(original: DatabaseRecord, update: DatabaseRecord): Promise<void> {
    const dbPath = this.currentFile.value?.file.path
    const database = this.current.value?.database
    const index = database?.records.indexOf(original) ?? -1

    if (index > -1 && dbPath) {
      await recins(dbPath, database?.type, index, update)
      this.reloadCurrentView()
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

    const dbPath = this.currentFile.value?.file.path
    const database = this.current.value?.database

    if (!dbPath || !database) return

    const index = database.records.indexOf(record)

    if (index > -1) {
      await recdel(dbPath, database?.type, index)
      this.reloadCurrentView()
    }

    this.closeEditor()
  }

  private reloadCurrentView(): void {
    const view = this.current.value?.config
    if (view) this.openView(view)
  }

  toggleViewEditor(): void {
    this.editingView.value = !this.editingView.value
  }

  toggleViewCreator(): void {
    this.creatingView.value = !this.creatingView.value
  }
}
