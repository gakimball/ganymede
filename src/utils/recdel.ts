import { Command } from '@tauri-apps/api/shell'
import { logger } from './logger'
import { RecutilsSelector } from '../types/recutils'
import { getRecinsArgs } from './get-recins-args'

export const recdel = async (
  dbPath: string,
  selector: RecutilsSelector,
) => {
  const args: string[] = getRecinsArgs(selector)

  args.push(dbPath)

  const cmd = new Command('recdel', args)
  const res = await cmd.execute()

  if (res.stderr) logger.error('Error running recdel', {
    error: res.stderr,
    args,
  })
}
