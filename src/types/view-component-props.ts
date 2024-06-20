import { Database } from './database';
import { ViewConfig } from './view-config';

export interface ViewComponentProps extends Database {
  config: ViewConfig;
}
