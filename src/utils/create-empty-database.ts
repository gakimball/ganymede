import { Database } from '../types/database';

export const createEmptyDatabase = (): Database => ({
  fields: new Map(),
  records: [],
})
