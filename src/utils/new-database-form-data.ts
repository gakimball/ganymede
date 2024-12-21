import { NewDatabaseFormFieldEditorValue } from '../components/forms/new-database-form-field-editor';
import { DatabaseRecord } from '../types/database';

export interface NewDatabaseFormData {
  fileName: string;
  recordName: string;
  fields: NewDatabaseFormFieldEditorValue[];
}

export const newDatabaseFormData = {
  toRecord: (data: NewDatabaseFormData): DatabaseRecord => {
    const bodyField = data.fields.find(field => field.type === 'body')?.name

    return {
      '%rec': [data.recordName],
      '%allowed': [
        data.fields
          .map(field => field.name)
          .join(' ')
      ],
      '%mandatory': [
        data.fields
          .filter(field => field.mandatory)
          .map(field => field.name)
          .join(' ')
      ],
      '%type': data.fields
        .filter(field => field.type !== 'string' && field.type !== 'body')
        .map(field => `${field.type} ${field.enum?.join(' ') ?? ''}`.trim()),
      '%body': bodyField ? [bodyField] : [],
    }
  },

  fromRecord: (record: DatabaseRecord): NewDatabaseFormFieldEditorValue[] => {
    const fieldMap: Record<string, NewDatabaseFormFieldEditorValue> = {}

    record['%allowed']?.[0].split(' ').forEach(fieldName => {
      fieldMap[fieldName] = {
        name: fieldName,
        mandatory: false,
        type: 'string',
      }
    })

    record['%mandatory']?.[0].split(' ').forEach(fieldName => {
      const field = fieldMap[fieldName]
      if (field) field.mandatory = true
    })

    record['%type']?.map(value => {
      const [fieldName, typeName, ...params] = value.split(/\s/)
      const field = fieldMap[fieldName]

      if (field) {
        field.type = typeName as NewDatabaseFormFieldEditorValue['type']

        if (typeName === 'enum') {
          field.enum = params
        }
      }
    })

    return Object.values(fieldMap)
  }
}
