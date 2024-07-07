import { Command } from '@tauri-apps/api/shell'

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

  if (res.stderr) console.log(res.stderr)
}
