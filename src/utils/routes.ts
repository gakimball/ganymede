import { ViewConfig } from '../utils/view-config';
import queryString from 'query-string';

export const ROUTES = {
  file: (filePath: string, view?: ViewConfig) => {
    return queryString.stringifyUrl({
      url: '/file',
      query: {
        path: filePath,
        view: view?.Name,
      }
    })
  }
}
