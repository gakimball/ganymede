import { Command } from '@tauri-apps/api/shell'
import { logger } from './logger'

export const recdel = async (
  dbPath: string,
  recordType: string | undefined,
  recordIndex?: number,
  selector?: string
) => {
  const args: string[] = []

  if (recordType) {
    args.push('-t', recordType)
  }

  if (recordIndex) {
    args.push('-n', String(recordIndex))
  }

  if (selector !== undefined) {
    args.push('-e', selector)
  }

  args.push(dbPath)

  const cmd = new Command('recdel', args)
  const res = await cmd.execute()

  if (res.stderr) logger.error('Error running recdel', {
    error: res.stderr,
    args,
  })
}
