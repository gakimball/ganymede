import { Signal, computed, effect, signal } from '@preact/signals';
import { createEmptyDatabase } from '../utils/create-empty-database';
import { ViewConfig, toViewConfig } from '../utils/view-config';
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
import { createPlaceholderViewConfig } from '../utils/create-placeholder-view-config';

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
    return this.views.value.records.map(record => toViewConfig(record))
  })

  readonly fields = computed((): DatabaseFieldMap => this.views.value.fields)

  constructor(
    private readonly currentFile: Signal<CurrentFile | null>,
    private readonly configFile: Signal<FileEntry | null>
  ) {
    effect(() => {
      const file = configFile.value
      if (file) this.reloadViews(file.path)
    })
  }

  async reloadViews(dbPath: string): Promise<void> {
    this.views.value = await queryRecfile(dbPath, {
      ...createPlaceholderViewConfig(),
      name: 'Views',
      file: '_ganymede.rec',
      layout: 'Text',
      type: 'View',
    })
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
        ...createPlaceholderViewConfig(),
        name: 'Text',
        layout: 'Text',
        file: file?.name ?? '',
      })
    } else {
      const view = this.list.value
        .find(view => view.file === file.name && view.name === viewName)

      if (view) this.openView(view)
    }
  }

  openDefaultViewForFile(file: FileEntry) {
    const view = this.list.value
      .find(view => view.file === file.name)
      ?? {
        ...createPlaceholderViewConfig(),
        name: 'Text',
        layout: 'Text',
        file: file.name ?? '',
      }

    this.openView(view)
  }

  async createView(view: DatabaseRecord): Promise<void> {
    const dbPath = this.configFile.value?.path
    const file = this.currentFile.value?.file

    if (!dbPath || !file) return

    await recins(dbPath, {
      type: this.views.value.type,
    }, view)
    await this.reloadViews(dbPath)
    const asConfig = toViewConfig(view)
    // x-ref: GNY-01
    history.replaceState(null, '', ROUTES.file(file.path, asConfig))
    this.openViewByName(file, asConfig.name)
    this.toggleViewCreator()
  }

  async editCurrentView(changes: DatabaseRecord): Promise<void> {
    const current = this.current.value
    const dbPath = this.configFile.value?.path
    const file = this.currentFile.value?.file

    if (!current || !dbPath || !file) return

    const index = this.list.value.indexOf(current.config)

    if (index > -1) {
      await recins(dbPath, {
        type: this.views.value.type,
        index,
      }, changes)
      await this.reloadViews(dbPath)
      const asConfig = toViewConfig(changes)
      // x-ref: GNY-01
      history.replaceState(null, '', ROUTES.file(file.path, asConfig))
      this.openViewByName(file, asConfig.name)
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
    const dbPath = this.configFile.value?.path
    const file = this.currentFile.value?.file

    if (!current || !dbPath || !file) return

    const index = this.list.value.indexOf(current.config)

    if (index > -1) {
      await recdel(dbPath, {
        type: this.views.value.type,
        index,
      })
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
        ...Object.entries(record).flatMap(([field, values]) => {
          return values?.flatMap(value => {
            return ['-f', field, '-v', value]
          }) ?? []
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
      await recins(dbPath, {
        type: database?.type,
        index,
      }, update)
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
      await recdel(dbPath, {
        type: database?.type,
        index,
      })
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
