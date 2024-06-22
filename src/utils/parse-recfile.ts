import Formula from 'fparser'
import { Database, DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database'
import { createEmptyRecord } from './create-empty-record'
import { emplaceMap } from './emplace-map'
import { parseTypeDef } from './parse-typedef'
import { createFormula } from './create-formula'

const FIELD_REGEX = /^(?<name>[a-zA-Z%][a-zA-Z0-9_]*):\s(?<value>.+)/

const upsertField = (
  map: Map<string, DatabaseField>,
  key: string,
  props: Partial<DatabaseField> = {}
) => emplaceMap(map, key, {
  insert: () => ({
    type: RecordFieldType.STRING,
    ...props,
  }),
  update: existing => ({
    ...existing,
    ...props,
  })
})

/**
 * Convert a raw recfile into a database, containing a map of fields and a list of records.
 */
export const parseRecfile = (contents: string): Database => {
  const fields = new Map<string, DatabaseField>()
  const records = new Set<DatabaseRecord>()
  let currentRecord: DatabaseRecord = {}

  contents.split('\n').forEach(line => {
    line = line.trim()

    if (line === '') {
      currentRecord = createEmptyRecord(fields)
      return
    }

    if (line.startsWith('#formula')) {
      const [, fieldName, ...rest] = line.split(' ')

      upsertField(fields, fieldName, {
        type: RecordFieldType.FORMULA,
        formula: createFormula(rest.join(' ')),
      })
    }

    if (line.startsWith('#')) {
      return
    }

    const res = FIELD_REGEX.exec(line)

    if (!res?.groups) {
      return
    }

    const { name, value } = res.groups

    if (name.startsWith('%')) {
      switch (name) {
        case '%type': {
          const { field, ...props } = parseTypeDef(value)
          upsertField(fields, field, props)
        }
      }
      return
    }

    upsertField(fields, name)
    records.add(currentRecord)
    currentRecord[name] = value
  })

  return {
    fields,
    records: [...records.values()],
  }
}
