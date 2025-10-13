import { FileEntry, readDir } from '@tauri-apps/api/fs';
import { parseFileName } from './parse-file-name';

export async function getDefaultNewFileName(file: FileEntry) {
  const { jdNumber } = parseFileName(file)

  if (!jdNumber) {
    return ''
  }

  const files = await readDir(file.path)
  const numbers = files
    .map(file => parseFileName(file).jdNumber)
    .filter((number): number is string => number !== undefined)
    .sort()

  if (!numbers.length) {
    return ''
  }

  const lastItem = Number.parseInt(numbers[numbers.length - 1].split('.')[1], 10)

  if (Number.isNaN(lastItem)) {
    return ''
  }

  return `${jdNumber.trim()}.${lastItem + 1} `
}
