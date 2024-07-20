import { DatabaseField, DatabaseFieldType } from '../types/database'

/**
 * Parse a `%type` type from a recfile. Some related types (e.g. `int` and `real`) are currently
 * consolidated into one type.
 */
export const parseTypeDef = (value: string): DatabaseField => {
  const [name, type, ...params] = value.split(/\s/)

  switch (type) {
    case 'int':
    case 'range':
    case 'real':
      return {
        name,
        type: DatabaseFieldType.INT,
      }
    case 'enum':
      return {
        name,
        type: DatabaseFieldType.ENUM,
        params,
      }
    case 'bool':
      return {
        name,
        type: DatabaseFieldType.BOOL,
      }
    case 'Formula':
      return {
        name,
        type: DatabaseFieldType.FORMULA,
      }
    case 'date': {
      return {
        name,
        type: DatabaseFieldType.DATE,
      }
    }
    case 'line':
    case 'size':
    case 'regexp':
    case 'email':
    case 'uuid':
    default:
      return {
        name,
        type: DatabaseFieldType.STRING
      }
  }
}
