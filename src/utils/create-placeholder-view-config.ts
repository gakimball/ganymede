import { ViewConfig } from './view-config';

export const createPlaceholderViewConfig = (): ViewConfig => ({
  name: '',
  file: '',
  layout: 'Text',
  type: null,
  fields: null,
  filter: null,
  fullPage: false,
  group: null,
  aggregate: null,
  render: [],
  sort: null,
  sum: [],
})
