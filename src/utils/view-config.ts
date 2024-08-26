import { DatabaseFieldType, DatabaseRecord } from '../types/database';
import { parseFieldValue } from './parse-field-value';

export type RenderRule = (
  { type: 'money' }
  | { type: 'percent' }
  | { type: 'unknown'; text: string }
  | { type: 'date'; format: string }
)

export interface ViewConfig {
  name: string;
  layout: 'Table' | 'Board' | 'List' | 'Aggregate' | 'Text';
  file: string;
  type: string | null;
  sort: {
    fields: string[];
    descending: boolean;
  } | null;
  filter: string | null;
  group: string | null;
  fields: string[] | null;
  render: Array<{
    field: string;
    rule: RenderRule;
  }>;
  sum: string[];
  fullPage: boolean;
}

export const toViewConfig = (record: DatabaseRecord): ViewConfig => {
  return {
    name: record.Name![0],
    layout: record.Layout![0] as ViewConfig['layout'],
    file: record.File![0],
    type: record.Type?.[0] ?? null,
    sort: record.Sort ? {
      fields: record.Sort[0].replace(/ desc$/, '').split(' '),
      descending: record.Sort[0].endsWith(' desc'),
    } : null,
    filter: record.Filter?.[0] ?? null,
    group: record.Group?.[0] ?? null,
    fields: record.Fields?.[0].split(' ') ?? null,
    render: record.Render?.map((value) => {
      const [field, rule] = value.split(' ')

      if (rule === 'money' || rule === 'percent') {
        return {
          field,
          rule: {
            type: rule,
          }
        }
      }

      if (rule === 'date') {
        return {
          field,
          rule: {
            type: rule,
            format: rule.replace(/_/g, ' '),
          }
        }
      }

      return {
        field,
        rule: {
          type: 'unknown',
          text: rule,
        }
      }
    }) ?? [],
    sum: record.Sum?.[0].split(' ') ?? [],
    fullPage: parseFieldValue(record.Full_Page?.[0], {
      name: 'Full_Page',
      type: DatabaseFieldType.BOOL,
    }) === true,
  }
}

export const toDatabaseRecord = (view: ViewConfig): DatabaseRecord => {
  return {
    Name: [view.name],
    Layout: [view.layout],
    File: [view.file],
    Type: view.type ? [view.type] : undefined,
    Sort: view.sort ? [
      `${view.sort.fields.join(' ')}${view.sort.descending ? ' desc' : ''}`
    ] : undefined,
    Filter: view.filter ? [view.filter] : undefined,
    Group: view.group ? [view.group] : undefined,
    Fields: view.fields ? [view.fields.join(' ')] : undefined,
    Render: view.render.map(({ field, rule }) => {
      let defn: string = rule.type

      switch (rule.type) {
        case 'date':
          defn += ` ${rule.format}`; break;
        case 'unknown':
          defn = rule.text; break;
      }

      return `${field} ${defn}`
    }),
    Sum: view.sum.length ? [view.sum.join(' ')] : undefined,
    Full_Page: view.fullPage ? ['true'] : undefined,
  }
}
