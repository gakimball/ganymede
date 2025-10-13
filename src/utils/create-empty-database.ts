import { Database } from '../types/database';

export const createEmptyDatabase = (): Database => ({
  key: '',
  type: undefined,
  fields: new Map(),
  records: [],
  errors: [],
})
