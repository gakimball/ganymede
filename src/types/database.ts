export interface Database {
  fields: Map<string, DatabaseField>;
  records: DatabaseRecord[];
}

export type DatabaseField = {
  type: RecordFieldType;
  mandatory?: true;
  unique?: true;
  auto?: true;
  params?: string[];
};

export type DatabaseRecord = Record<string, RecordField | undefined>

export type RecordField = string

export enum RecordFieldType {
  INT = 'INT',
  RANGE = 'RANGE',
  REAL = 'REAL',
  STRING = 'STRING',
  ENUM = 'ENUM',
  BOOL = 'BOOL',
  DATE = 'DATE',
}
