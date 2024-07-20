import { Command } from '@tauri-apps/api/shell'
import { ViewConfig } from '../utils/view-config'
import { logger } from './logger'
import { parseRecfile } from './parse-recfile'

export const queryRecfile = async (path: string, view?: ViewConfig) => {
  const args = [path, '-d', '--print-sexps']

  if (view?.Type) {
    args.push('-t', view.Type)
  }

  if (view?.Filter) {
    args.push('-e', view.Filter)
  }

  if (view?.Sort) {
    args.push('-S', view.Sort.replace(/ desc$/, ''))
  }

  if (view?.Layout === 'Aggregate') {
    if (view?.Group) {
      args.push('-G', view.Group)
    }

    if (view?.Fields) {
      args.push('-p', view.Fields.replace(/ /g, ','))
    }
  }

  const cmd = new Command('recsel', args)
  const { stdout, stderr } = await cmd.execute()

  if (stderr) {
    logger.error('Error running recsel', {
      error: stderr,
      args,
    })
  }

  return parseRecfile(stdout)
}
