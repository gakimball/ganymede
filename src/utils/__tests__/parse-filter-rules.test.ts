import { parseFilterRules } from '../parse-filter-rules';
import { FilterTest } from '../test-filter';

type TestCase = [
  input: string,
  expected: Partial<FilterTest>[] | Partial<FilterTest>,
]

const testCases: TestCase[] = [
  ['Field set', { condition: 'set' }],
  ['Field not set', { condition: 'set', not: true }],

  ['Field eq value', { condition: 'eq', value: 'value' }],
  ['Field gt value', { condition: 'gt', value: 'value' }],
  ['Field gte value', { condition: 'gte', value: 'value' }],
  ['Field lt value', { condition: 'lt', value: 'value' }],
  ['Field lte value', { condition: 'lte', value: 'value' }],

  ['Field_A eq value and Field_B not gte 0 or Field_C set', [
    {
      field: 'Field_A',
      condition: 'eq',
      value: 'value',
      boolean: 'and',
    },
    {
      field: 'Field_B',
      condition: 'gte',
      value: '0',
      not: true,
      boolean: 'or',
    },
    {
      field: 'Field_C',
      condition: 'set',
      boolean: 'and',
    }
  ]]
]

test.each(testCases)('%s', (input, test) => {
  let expected = Array.isArray(test) ? test : [test]
  expected = expected.map((props): FilterTest => ({
    condition: 'eq',
    not: false,
    boolean: 'and',
    field: 'Field',
    value: '',
    ...props,
  }))

  expect(parseFilterRules(input)).toEqual(expected)
})
