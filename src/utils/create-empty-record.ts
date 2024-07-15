import { DatabaseField, DatabaseRecord, DatabaseFieldType, DatabaseFieldMap } from '../types/database';
import { parseFieldValue } from './parse-field-value';

export const createEmptyRecord = (fields: DatabaseFieldMap): DatabaseRecord => {
  const proxy = new Proxy<DatabaseRecord>({}, {
    get(target, key) {
      const field = fields.get(String(key))

      if (field?.type === DatabaseFieldType.FORMULA) {
        let value
        // Why it works this way for now: when you call `evaluate()`, it iterates through every key
        // on the object you pass before executing the formula. That means we can't pass an empty
        // Proxied object, because there's nothing to iterate through. The library doesn't do this
        // recursively, though, so we can pass our Proxy in a property.
        try {
          value = field.formula?.evaluate({ _: formulaProxy })
        } catch (err) {
          value = '(formula error)'
        }

        return [value]
      }

      return Reflect.get(target, key)
    }
  })
  const formulaProxy = new Proxy({}, {
    get(_, key) {
      if (typeof key === 'symbol') return 0;
      const value = parseFieldValue(proxy[key]?.[0], fields.get(key)!)
      if (typeof value === 'string') return value ? 1 : 0
      if (value instanceof Date) return value.valueOf()
      return Number(value)
    },
  })

  return proxy
}
