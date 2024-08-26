import { Command } from '@tauri-apps/api/shell'
import { ViewConfig } from '../utils/view-config'
import { logger } from './logger'
import { parseRecfile } from './parse-recfile'

export const queryRecfile = async (path: string, view?: ViewConfig) => {
  const args = [path, '-d', '--print-sexps']

  if (view?.type) {
    args.push('-t', view.type)
  }

  if (view?.filter) {
    args.push('-e', view.filter)
  }

  if (view?.sort) {
    args.push('-S', view?.sort.fields.join(' '))
  }

  if (view?.layout === 'Aggregate') {
    if (view?.group) {
      args.push('-G', view.group)
    }

    if (view?.fields) {
      args.push('-p', view.fields.join(','))
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
