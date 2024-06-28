import { DatabaseField, DatabaseRecord, RecordFieldType } from '../../types/database';
import { FilterTest, testFilter } from '../test-filter';

const record: DatabaseRecord = {
  String: 'string',
  Number: '1',
  Bool: 'yes',
}
const fields = new Map<string, DatabaseField>([
  ['String', {
    type: RecordFieldType.STRING,
  }],
  ['Number', {
    type: RecordFieldType.INT,
  }],
  ['Bool', {
    type: RecordFieldType.BOOL,
  }],
  ['Enum', {
    type: RecordFieldType.ENUM,
    params: ['Option'],
  }]
])

type TestCase = [
  condition: FilterTest['condition'],
  tests: Array<[
    pass: boolean,
    description: string,
    test: Partial<FilterTest>,
  ]>,
]

const testCases: TestCase[] = [
  ['set', [
    [true, 'defined', {}],
    [false, 'not defined', { field: 'Enum' }],
  ]],
  ['eq', [
    [true, 'strings match', { value: 'string' }],
    [false, 'strings do not match', { value: 'nope' }],
    [true, 'numbers are equal', { field: 'Number', value: '1' }],
    [false, 'numbers are not equal', { field: 'Number', value: '2' }],
    [true, 'booleans match', { field: 'Bool', value: 'true' }],
    [false, 'booleans do not match', { field: 'Bool', value: 'false' }],
  ]],
  ['gt', [
    [true, 'string is greater alphabetically', { value: 'a' }],
    [false, 'string is lesser alpahbetically', { value: 'z' }],
    [true, 'number is greater', { field: 'Number', value: '0' }],
    [false, 'number is lesser', { field: 'Number', value: '2' }],
  ]],
  ['gte', [
    [true, 'string is greater than/equal alphabetically', { value: 'string' }],
    [false, 'string is lesser alpahbetically', { value: 'z' }],
    [true, 'number is greater than/equal', { field: 'Number', value: '1' }],
    [false, 'number is lesser', { field: 'Number', value: '2' }],
  ]],
  ['lt', [
    [true, 'string is lesser alphabetically', { value: 'z' }],
    [false, 'string is greater alpahbetically', { value: 'a' }],
    [true, 'number is lesser', { field: 'Number', value: '2' }],
    [false, 'number is greater', { field: 'Number', value: '0' }],
  ]],
  ['lte', [
    [true, 'string is lesser than/equal alphabetically', { value: 'string' }],
    [false, 'string is greater alpahbetically', { value: 'a' }],
    [true, 'number is lesser than/equal', { field: 'Number', value: '1' }],
    [false, 'number is greater', { field: 'Number', value: '0' }],
  ]]
]

describe.each(testCases)('%s', (condition, tests) => {
  test.each(tests)('%s if %s', (pass, _, test) => {
    expect(
      testFilter(record, fields, {
        condition,
        not: false,
        boolean: 'and',
        field: 'String',
        value: '',
        ...test,
      })
    ).toBe(pass)
  })
})
