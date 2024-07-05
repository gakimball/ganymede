import { Command } from '@tauri-apps/api/shell'
import { DatabaseRecord } from '../types/database'

export const recins = async (
  dbPath: string,
  recordIndex: number,
  record: DatabaseRecord,
) => {
  const cmd = new Command('recins', [
    '-n',
    String(recordIndex),
    ...Object.entries(record).flatMap(([field, value]) => {
      if (!value) {
        return []
      }

      return ['-f', field, '-v', value]
    }),
    dbPath
  ])

  const res = await cmd.execute()

  if (res.stdout) console.log(res.stdout)
  if (res.stderr) console.log(res.stderr)
}
