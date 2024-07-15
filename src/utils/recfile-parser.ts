import { Database, DatabaseField, DatabaseFieldMap, DatabaseFieldType, DatabaseRecord } from '../types/database';
import { createEmptyRecord } from './create-empty-record';
import { createFormula } from './create-formula';
import { emplaceMap } from './emplace-map';
import { logger } from './logger';
import { parseTypeDef } from './parse-typedef';

const FIELD_REGEX = /^(?<name>[a-zA-Z%][a-zA-Z0-9_]*):(?<valueExists>\s(?<value>.+))?/

export class RecfileParser {
  private readonly fields: DatabaseFieldMap = new Map()

  private readonly records = new Set<DatabaseRecord>()

  private type?: string;

  private currentRecord: DatabaseRecord = {}

  private multilineParse?: { name: string; value: string }

  private errors: string[] = []

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

  private upsertRecord(
    key: string,
    value: string,
  ) {

  }

  toDatabase(): Database {
    return {
      type: this.type,
      fields: this.fields,
      records: [...this.records],
      errors: this.errors,
    }
  }

  parseLine(line: string): void {
    line = line.trim()

    if (this.multilineParse !== undefined) {
      if (line.startsWith('+')) {
        this.multilineParse.value += line.slice(2) + '\n'
        return
      } else {
        this.currentRecord[this.multilineParse.name] = [this.multilineParse.value.slice(0, -1)]
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
        case '%rec': {
          this.type = value
          break
        }
        case '%type': {
          const { field, ...props } = parseTypeDef(value)
          this.upsertField(field, props)
          break
        }
        case '%formula': {
          const [, fieldName, ...rest] = line.split(' ')
          let formula
          const formulaText = rest.join(' ')
          try {
            formula = createFormula(formulaText)
          } catch (err) {
            logger.warn('Error parsing formula', {
              formula: formulaText,
              error: err,
            })
            this.errors.push(`Error parsing this formula:\n\n${formulaText}\n\n${(err as Error).message}`)
            break
          }
          this.upsertField(fieldName, {
            type: DatabaseFieldType.FORMULA,
            formula,
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
    const field = this.currentRecord[name]
    if (field) field.push(value)
    else this.currentRecord[name] = [value]
  }
}
