import { DatabaseFieldMap } from '../types/database';
import { ViewConfig } from '../utils/view-config';

/**
 * Return a Map of fields to display on each record within a view, based on the view's
 * Fields config.
 */
export const getShownFields = (fields: DatabaseFieldMap, config: ViewConfig | null | undefined) => {
  const fieldList = [...fields.values()]
  let shownFields = config?.fields ?? [...fields.keys()]
  // Convert an aggregate field defn like:
  // `Sum(Amount):Amount` => `Amount`
  shownFields = shownFields.map(field => {
    const segments = field.split(':')
    return segments[segments.length - 1]
  })

  return fieldList
    .filter(field => shownFields.includes(field.name))
    .sort((fieldA, fieldB) => shownFields.indexOf(fieldA.name) - shownFields.indexOf(fieldB.name))
}
