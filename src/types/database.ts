import type Formula from 'fparser'

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
  formula?: Formula;
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
  FORMULA = 'FORMULA',
}
