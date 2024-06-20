import { FunctionComponent } from 'preact';
import { FieldValue } from './field-value';
import { ViewComponentProps } from '../types/view-component-props';
import { useMemo } from 'preact/hooks';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';

export const Table: FunctionComponent<ViewComponentProps> = ({
  fields,
  records,
  config,
}) => {
  const tables = useMemo(() => {
    return createViewGroups({ records, fields }, config)
  }, [records, fields, config])
  const shownFields = getShownFields({ fields, records }, config)

  return (
    <>
      {tables.map(table => (
        <>
          {table.title && config.Group && (
            <span className="badge text-bg-primary">
              {table.title}
            </span>
          )}
          <table className="table">
            <thead>
              <tr>
                {[...shownFields.keys()].map((field) => (
                  <th key={field} scope="col">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.records.map(record => (
                <tr>
                  {[...shownFields.entries()].map(([name, field]) => (
                    <td key={name}>
                      <FieldValue value={record[name]} field={field} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  )
}
