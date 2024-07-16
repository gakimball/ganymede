import { DatabaseFieldMap, DatabaseFieldType } from '../../types/database';
import { parseFormData } from '../parse-form-data';

// @ts-expect-error
global.FormData = Map

const fields: DatabaseFieldMap = new Map([
  ['string', {
    name: 'string',
    type: DatabaseFieldType.STRING,
  }],
  ['bool', {
    name: 'bool',
    type: DatabaseFieldType.BOOL,
  }]
])

test('returns form values as database record fields', () => {
  const formData = new FormData()
  formData.set('string', 'kittens')
  const record = parseFormData(formData, fields)

  expect(record).toEqual({
    string: ['kittens'],
  })
})

test('for boolean fields, converts a checkbox "on" value to true', () => {
  const formData = new FormData()
  formData.set('bool', 'on')
  const record = parseFormData(formData, fields)

  expect(record).toEqual({
    bool: ['true'],
  })
})

test('omits missing values', () => {
  const formData = new FormData()
  const record = parseFormData(formData, fields)

  expect(record).toEqual({})
})

test('omits empty strings', () => {
  const formData = new FormData()
  formData.set('string', '')
  const record = parseFormData(formData, fields)

  expect(record).toEqual({})
})

test('omits form values not defined as database fields', () => {
  const formData = new FormData()
  formData.set('nope', 'hello')
  const record = parseFormData(formData, fields)

  expect(record).toEqual({})
})

test('allows for multiple field values with array notation', () => {
  const formData = new FormData()
  formData.set('string.0', 'one')
  formData.set('string.1', 'two')
  const record = parseFormData(formData, fields)

  expect(record).toEqual({
    string: ['one', 'two'],
  })
})
