import { Database, DatabaseFieldMap } from '../types/database';
import { ViewConfig } from '../utils/view-config';

/**
 * Return a Map of fields to display on each record within a view, based on the view's
 * Fields config.
 */
export const getShownFields = (fields: DatabaseFieldMap, config: ViewConfig | null | undefined) => {
  const fieldList = [...fields.values()]
  const shownFields = config?.fields ?? [...fields.keys()]

  return fieldList
    .filter(field => shownFields.includes(field.name))
    .sort((fieldA, fieldB) => shownFields.indexOf(fieldA.name) - shownFields.indexOf(fieldB.name))
}
