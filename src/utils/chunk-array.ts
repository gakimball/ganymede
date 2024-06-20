/**
 * Split a single array into multiple arrays of `size` length each.
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  let chunk: T[] = []

  for (let i = 0; i < array.length; i++) {
    chunk.push(array[i])

    if ((i + 1) % size === 0) {
      chunks.push(chunk)
      chunk = []
    }
  }

  return chunks
}
