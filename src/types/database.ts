import type Formula from 'fparser'

export interface Database {
  type: string | undefined;
  fields: DatabaseFieldMap;
  records: DatabaseRecord[];
  errors: string[];
}

export type DatabaseFieldMap = Map<string, DatabaseField>;

export type DatabaseField = {
  name: string;
  type: DatabaseFieldType;
  mandatory?: true;
  unique?: true;
  auto?: true;
  params?: string[];
  formula?: Formula;
};

export type DatabaseRecord = Record<string, string[] | undefined>

export enum DatabaseFieldType {
  INT = 'INT',
  RANGE = 'RANGE',
  REAL = 'REAL',
  STRING = 'STRING',
  ENUM = 'ENUM',
  ENUM_MULTI = 'ENUM_MULTI',
  BOOL = 'BOOL',
  DATE = 'DATE',
  FORMULA = 'FORMULA',
  BODY = 'BODY',
}
