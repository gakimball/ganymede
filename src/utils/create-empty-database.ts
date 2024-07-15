import { Database } from '../types/database';

export const createEmptyDatabase = (): Database => ({
  type: undefined,
  fields: new Map(),
  records: [],
  errors: [],
})
