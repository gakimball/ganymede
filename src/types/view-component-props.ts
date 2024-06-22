import { Database, DatabaseRecord } from './database';
import { ViewConfig } from './view-config';

export interface ViewComponentProps extends Database {
  config: ViewConfig;
  onSelectRecord: (record: DatabaseRecord) => void;
}
