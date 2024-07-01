import { DatabaseRecord, DatabaseFieldType } from '../../types/database'
import { getSortComparator } from '../get-sort-comparator'

const a: DatabaseRecord = {
  String: 'a',
  Number: '0',
  Bool: 'yes',
  Date: '2000-01-01',
}
const b: DatabaseRecord = {
  String: 'b',
  Number: '1',
  Bool: 'yes',
  Date: '2000-01-02',
}
const c: DatabaseRecord = {
  String: 'c',
  Number: '2',
  Bool: 'no',
  Date: '2000-01-03',
}
const records = [b, c, a]

describe('strings', () => {
  test('sorts alphabetically asc', () => {
    const compare = getSortComparator({ name: 'String', type: DatabaseFieldType.STRING })

    expect([...records].sort(compare)).toEqual([a, b, c])
  })

  test('sorts alphabetically desc', () => {
    const compare = getSortComparator({ name: 'String', type: DatabaseFieldType.STRING }, true)

    expect([...records].sort(compare)).toEqual([c, b, a])
  })
})

describe('numbers', () => {
  test('sorts numerically asc', () => {
    const compare = getSortComparator({ name: 'Number', type: DatabaseFieldType.INT })

    expect([...records].sort(compare)).toEqual([a, b, c])
  })

  test('sorts numerically desc', () => {
    const compare = getSortComparator({ name: 'Number', type: DatabaseFieldType.INT }, true)

    expect([...records].sort(compare)).toEqual([c, b, a])
  })
})

describe('booleans', () => {
  test('sorts false first asc', () => {
    const compare = getSortComparator({ name: 'Bool', type: DatabaseFieldType.BOOL })

    expect([...records].sort(compare)).toEqual([c, b, a])
  })

  test('sorts true first desc', () => {
    const compare = getSortComparator({ name: 'Bool', type: DatabaseFieldType.BOOL }, true)

    expect([...records].sort(compare)).toEqual([b, a, c])
  })
})

describe('dates', () => {
  test('sorts earliest first asc', () => {
    const compare = getSortComparator({ name: 'Date', type: DatabaseFieldType.DATE })

    expect([...records].sort(compare)).toEqual([a, b, c])
  })

  test('sorts latest first desc', () => {
    const compare = getSortComparator({ name: 'Date', type: DatabaseFieldType.DATE }, true)

    expect([...records].sort(compare)).toEqual([c, b, a])
  })
})
