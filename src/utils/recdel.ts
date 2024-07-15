import { Command } from '@tauri-apps/api/shell'
import { logger } from './logger'

export const recdel = async (
  dbPath: string,
  recordType: string | undefined,
  recordIndex: number,
) => {
  const args = ['-n', String(recordIndex)]

  if (recordType) {
    args.push('-t', recordType)
  }

  args.push(dbPath)

  const cmd = new Command('recdel', args)
  const res = await cmd.execute()

  if (res.stderr) logger.error('Error running recdel', {
    error: res.stderr,
    args,
  })
}
