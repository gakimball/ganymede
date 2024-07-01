import { Database, DatabaseField, DatabaseRecord, RecordFieldType } from '../types/database'
import { createEmptyRecord } from './create-empty-record'
import { emplaceMap } from './emplace-map'
import { parseTypeDef } from './parse-typedef'
import { createFormula } from './create-formula'

const FIELD_REGEX = /^(?<name>[a-zA-Z%][a-zA-Z0-9_]*):(?<valueExists>\s(?<value>.+))?/

const upsertField = (
  map: Map<string, DatabaseField>,
  key: string,
  props: Partial<DatabaseField> = {}
) => emplaceMap(map, key, {
  insert: () => ({
    name: key,
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
  let multilineParse: { name: string; value: string } | undefined

  contents.split('\n').forEach(line => {
    line = line.trim()

    if (multilineParse !== undefined) {
      if (line.startsWith('+')) {
        multilineParse.value += line.slice(2) + '\n'
        return
      } else {
        currentRecord[multilineParse.name] = multilineParse.value.slice(0, -1)
        upsertField(fields, multilineParse.name)
        multilineParse = undefined
      }
    }

    if (line === '') {
      currentRecord = createEmptyRecord(fields)
      return
    }

    if (line.startsWith('#')) {
      return
    }

    const res = FIELD_REGEX.exec(line)

    if (!res?.groups) {
      return
    }

    const { name, value, valueExists } = res.groups

    if (name.startsWith('%')) {
      switch (name) {
        case '%type': {
          const { field, ...props } = parseTypeDef(value)
          upsertField(fields, field, props)
          break
        }
        case '%formula': {
          const [, fieldName, ...rest] = line.split(' ')
          upsertField(fields, fieldName, {
            type: RecordFieldType.FORMULA,
            formula: createFormula(rest.join(' ')),
          })
          break
        }
        case '%body': {
          const [, fieldName] = line.split(' ')
          upsertField(fields, fieldName, {
            type: RecordFieldType.BODY,
          })
          break
        }
        case '%multi': {
          const [, fieldName, ...values] = line.split(' ')
          upsertField(fields, fieldName, {
            type: RecordFieldType.ENUM_MULTI,
            params: values,
          })
        }
      }
      return
    }

    if (!valueExists) {
      multilineParse = {
        name,
        value: '',
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
