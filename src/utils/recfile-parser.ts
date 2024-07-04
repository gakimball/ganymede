import { Database, DatabaseField, DatabaseFieldMap, DatabaseFieldType, DatabaseRecord } from '../types/database';
import { createEmptyRecord } from './create-empty-record';
import { createFormula } from './create-formula';
import { emplaceMap } from './emplace-map';
import { parseTypeDef } from './parse-typedef';

const FIELD_REGEX = /^(?<name>[a-zA-Z%][a-zA-Z0-9_]*):(?<valueExists>\s(?<value>.+))?/

export class RecfileParser {
  private readonly fields: DatabaseFieldMap = new Map()

  private readonly records = new Set<DatabaseRecord>()

  private currentRecord: DatabaseRecord = {}

  private multilineParse: { name: string; value: string } | undefined

  private upsertField(
    key: string,
    props: Partial<DatabaseField> = {}
  ) {
    return emplaceMap(this.fields, key, {
      insert: () => ({
        name: key,
        type: DatabaseFieldType.STRING,
        ...props,
      }),
      update: existing => ({
        ...existing,
        ...props,
      })
    })
  }

  toDatabase(): Database {
    return {
      fields: this.fields,
      records: [...this.records],
    }
  }

  parseLine(line: string): void {
    line = line.trim()

    if (this.multilineParse !== undefined) {
      if (line.startsWith('+')) {
        this.multilineParse.value += line.slice(2) + '\n'
        return
      } else {
        this.currentRecord[this.multilineParse.name] = this.multilineParse.value.slice(0, -1)
        this.upsertField(this.multilineParse.name)
        this.multilineParse = undefined
      }
    }

    if (line === '') {
      this.currentRecord = createEmptyRecord(this.fields)
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
          this.upsertField(field, props)
          break
        }
        case '%formula': {
          const [, fieldName, ...rest] = line.split(' ')
          this.upsertField(fieldName, {
            type: DatabaseFieldType.FORMULA,
            formula: createFormula(rest.join(' ')),
          })
          break
        }
        case '%body': {
          const [, fieldName] = line.split(' ')
          this.upsertField(fieldName, {
            type: DatabaseFieldType.BODY,
          })
          break
        }
        case '%multi': {
          const [, fieldName, ...values] = line.split(' ')
          this.upsertField(fieldName, {
            type: DatabaseFieldType.ENUM_MULTI,
            params: values,
          })
        }
      }
      return
    }

    if (!valueExists) {
      this.multilineParse = {
        name,
        value: '',
      }
      return
    }

    this.upsertField(name)
    this.records.add(this.currentRecord)
    this.currentRecord[name] = value
  }
}
