import sexp from 'sexp'
import { Database, DatabaseField, DatabaseFieldMap, DatabaseFieldType, DatabaseRecord } from '../types/database'
import { emplaceMap } from './emplace-map'
import { createDatabaseRecord } from './create-database-record'
import { parseTypeDef } from './parse-typedef'
import { parseFormulaDef } from './parse-formula-def'

export const parseRecfile = (input: string): Database => {
  const records: DatabaseRecord[] = []
  const errors: string[] = []
  let type: string | undefined

  const fieldMap: DatabaseFieldMap = new Map()
  const upsertField = (props: DatabaseField) => emplaceMap(fieldMap, props.name, {
    insert: () => props,
    update: existing => ({
      ...existing,
      ...props,
    })
  })

  // sexp structure:
  // (record id fields[])
  // fields have one of two signatures:
  // (field id name value)
  // (field name value)
  sexp(`(${input})`, {
    translateNumber: value => value,
  }).forEach((expr, index) => {
    if (!Array.isArray(expr)) return

    const fields = expr[2] as string[][]
    const isRecordDescriptor = index === 0
    const record = createDatabaseRecord(fieldMap)

    fields.forEach(field => {
      const name = field[field.length - 2]
      const value = field[field.length - 1]

      if (isRecordDescriptor) {
        switch (name) {
          case '%rec':
            type = value; break;
          case '%type':
            upsertField(parseTypeDef(value)); break;
          case '%formula':
            upsertField(parseFormulaDef(value)); break;
          case '%body':
            upsertField({ name, type: DatabaseFieldType.BODY }); break;
        }
      } else {
        if (!fieldMap.has(name)) upsertField({
          name,
          type: DatabaseFieldType.STRING,
        })

        if (record[name]) record[name]?.push(value)
        else record[name] = [value]
      }
    })

    if (!isRecordDescriptor) {
      records.push(record)
    }
  })

  return {
    type,
    fields: fieldMap,
    records,
    errors,
  }
}
