import { Database } from '../types/database';
import { ViewConfig } from '../types/view-config';

/**
 * Return a Map of fields to display on each record within a view, based on the view's
 * Fields config.
 */
export const getShownFields = (database: Database, config: ViewConfig) => {
  const fields = [...database.fields.values()]

  if (!config.Fields) {
    return fields
  }

  const shownFields = config.Fields.split(' ')

  return [...database.fields.values()]
    .filter(field => shownFields.includes(field.name))
    .sort((fieldA, fieldB) => shownFields.indexOf(fieldA.name) - shownFields.indexOf(fieldB.name))
}
