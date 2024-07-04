import { Command } from '@tauri-apps/api/shell'
import { ViewConfig } from '../types/view-config'
import { Database } from '../types/database'
import { RecfileParser } from './recfile-parser'

export const queryRecfile = async (path: string, view?: ViewConfig) => {
  const args = [path, '--include-descriptors']

  if (view?.Filter) {
    args.push('-e', view.Filter)
  }

  if (view?.Sort) {
    args.push('-S', view.Sort.replace(/ desc$/, ''))
  }

  const cmd = new Command('recsel', args)
  const parser = new RecfileParser()
  let error = ''

  cmd.stdout.on('data', data => parser.parseLine(data))
  cmd.stderr.on('data', data => (error += data))

  return new Promise<Database>((resolve) => {
    cmd.on('close', () => {
      if (error) {
        console.log('recsel error')
        console.log(error)
      }

      resolve(parser.toDatabase())
    })
    cmd.spawn()
  })
}
