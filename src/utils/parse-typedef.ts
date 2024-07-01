import { DatabaseFieldType } from '../types/database'

/**
 * Parse a `%type` type from a recfile. Some related types (e.g. `int` and `real`) are currently
 * consolidated into one type.
 */
export const parseTypeDef = (value: string) => {
  const [field, type, ...params] = value.split(' ')

  switch (type) {
    case 'int':
    case 'range':
    case 'real':
      return {
        field,
        type: DatabaseFieldType.INT,
      }
    case 'enum':
      return {
        field,
        type: DatabaseFieldType.ENUM,
        params,
      }
    case 'bool':
      return {
        field,
        type: DatabaseFieldType.BOOL,
      }
    case 'Formula':
      return {
        field,
        type: DatabaseFieldType.FORMULA,
      }
    case 'date': {
      return {
        field,
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
        field,
        type: DatabaseFieldType.STRING
      }
  }
}
