import { DatabaseRecord, DatabaseFieldType, DatabaseFieldMap } from '../types/database';
import { parseFieldValue } from './parse-field-value';

export const createDatabaseRecord = (fields: DatabaseFieldMap): DatabaseRecord => {
  const proxy = new Proxy<DatabaseRecord>({}, {
    get(target, key) {
      const field = fields.get(String(key))

      if (field?.type !== DatabaseFieldType.FORMULA) {
        return Reflect.get(target, key)
      }

      let formulaResult
      try {
        if (!field.formula) {
          throw new Error('No formula')
        }

        const context = Object.fromEntries(
          field.formula.getVariables().map(variable => {
            const field = fields.get(variable)
            if (!field) return [variable, 0]

            let value = parseFieldValue(proxy[variable]?.[0], field)
            if (typeof value === 'string') value = value ? 1 : 0
            else if (value instanceof Date) value = value.valueOf()
            else value = Number(value ?? 0)

            return [variable, value]
          })
        )

        formulaResult = field.formula.evaluate(context)
      } catch (err) {
        formulaResult = '(formula error)'
      }

      return [formulaResult]
    }
  })

  return proxy
}
