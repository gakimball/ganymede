import { Fragment, FunctionComponent } from 'preact';
import { FieldValue } from './field-value';
import { ViewComponentProps } from '../types/view-component-props';
import { useMemo } from 'preact/hooks';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import { getRenderRules } from '../utils/get-render-rules';
import { getSums } from '../utils/get-sums';

export const Table: FunctionComponent<ViewComponentProps> = ({
  fields,
  records,
  config,
  onSelectRecord,
}) => {
  const tables = useMemo(() => {
    return createViewGroups({ records, fields }, config)
  }, [records, fields, config])
  const shownFields = getShownFields({ fields, records }, config)
  const renderRules = getRenderRules(config, fields)
  const [hasSums, sums] = getSums(records, fields, config)

  return (
    <div className={tables.length > 1 ? 'mt-8' : 'mt-6'}>
      {tables.map(table => (
        <div>
          {table.title && table.field && (
            <div className="mb-4">
              <FieldValue value={table.title} field={table.field} />
            </div>
          )}
          <table className="w-full mb-6">
            <thead>
              <tr
                className="border-b-1 border-border h-10"
              >
                {[...shownFields.keys()].map((field) => (
                  <th key={field} scope="col" className="text-left">
                    <span className="text-body-secondary">
                      {field}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.records.map(record => (
                <tr
                  className="border-b-1 border-border cursor-pointer group"
                  onClick={() => onSelectRecord(record)}
                >
                  {[...shownFields.entries()].map(([fieldName, field]) => (
                    <td
                      key={fieldName}
                      className={`
                        h-10
                        text-content-secondary
                        first:text-content
                        first:group-hover:text-primary
                      `}
                    >
                      <FieldValue
                        value={record[fieldName]}
                        field={field}
                        render={renderRules[fieldName]}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {hasSums && (
              <tfoot>
                <tr>
                  {[...shownFields.entries()].map(([fieldName, field]) => (
                    <td key={fieldName} className="h-10">
                      {sums[fieldName]}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      ))}
    </div>
  )
}
