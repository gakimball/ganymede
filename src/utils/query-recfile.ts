import { Command } from '@tauri-apps/api/shell'
import { ViewConfig } from '../utils/view-config'
import { Database } from '../types/database'
import { RecfileParser } from './recfile-parser'
import { logger } from './logger'

export const queryRecfile = async (path: string, view?: ViewConfig) => {
  const args = [path, '--include-descriptors']

  if (view?.Type) {
    args.push('-t', view.Type)
  }

  if (view?.Filter) {
    args.push('-e', view.Filter)
  }

  if (view?.Sort) {
    args.push('-S', view.Sort.replace(/ desc$/, ''))
  }

  const cmd = new Command('recsel', args)
  const parser = new RecfileParser()
  let error = ''

  logger.debug('Running recsel', args)

  cmd.stdout.on('data', data => parser.parseLine(data))
  cmd.stderr.on('data', data => (error += data))

  return new Promise<Database>((resolve) => {
    cmd.on('close', () => {
      if (error) {
        logger.error('Error running recsel', {
          error,
          args,
        })
      }

      resolve(parser.toDatabase())
    })
    cmd.spawn()
  })
}
