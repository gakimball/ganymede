import { Command } from '@tauri-apps/api/shell'
import { DatabaseRecord } from '../types/database'

export const recins = async (
  dbPath: string,
  recordType: string | undefined,
  recordIndex: number | undefined,
  record: DatabaseRecord,
) => {
  const args: string[] = []

  if (recordType) {
    args.push('-t', recordType)
  }

  if (recordIndex !== undefined) {
    args.push('-n', String(recordIndex))
  }

  Object.entries(record).forEach(([field, value]) => {
    if (value) {
      args.push('-f', field, '-v', value)
    }
  })

  args.push(dbPath)

  console.log(args)

  const cmd = new Command('recins', args)
  const res = await cmd.execute()

  if (res.stderr) console.log(res.stderr)
}