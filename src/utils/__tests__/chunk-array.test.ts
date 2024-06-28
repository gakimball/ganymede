import { chunkArray } from '../chunk-array'

test('splits an array into chunks', () => {
  const input = [1, 2, 3, 4, 5, 6]

  expect(chunkArray(input, 2)).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
  ])
})
