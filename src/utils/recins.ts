import { Command } from '@tauri-apps/api/shell'
import { DatabaseRecord } from '../types/database'
import { logger } from './logger'
import { RecutilsSelector } from '../types/recutils'
import { getRecinsArgs } from './get-recins-args'

export const recins = async (
  dbPath: string,
  selector: RecutilsSelector,
  record: DatabaseRecord,
) => {
  const args = getRecinsArgs(selector)

  Object.entries(record).forEach(([field, values]) => {
    values?.forEach(value => {
      args.push('-f', field, '-v', value)
    })
  })

  args.push(dbPath)

  logger.debug('Running recins', args)

  const cmd = new Command('recins', args)
  const res = await cmd.execute()

  if (res.stderr) logger.error('Error running recins', res.stderr)
}
