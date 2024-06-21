import { Database } from '../types/database';
import { ViewConfig } from '../types/view-config';

/**
 * Return a Map of fields to display on each record within a view, based on the view's
 * Fields config.
 */
export const getShownFields = (database: Database, config: ViewConfig) => {
  if (!config.Fields) {
    return database.fields
  }

  const shownFields = config.Fields.split(' ')
  const fields = [...database.fields.entries()]
    .filter(([key]) => shownFields.includes(key))
    .sort(([keyA], [keyB]) => shownFields.indexOf(keyA) - shownFields.indexOf(keyB))

  return new Map(fields)
}
