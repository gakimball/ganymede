import { Fragment, FunctionComponent } from 'preact';
import { FieldValue } from './field-value';
import { ViewComponentProps } from '../types/view-component-props';
import { useMemo } from 'preact/hooks';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import s from './table.module.css'
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
    <>
      {tables.map(table => (
        <>
          {table.title && table.field && (
            <FieldValue value={table.title} field={table.field} />
          )}
          <table className="table table-hover">
            <thead>
              <tr>
                {[...shownFields.keys()].map((field) => (
                  <th key={field} scope="col">
                    <span className="text-body-secondary">
                      {field}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.records.map(record => (
                <tr className={s.row} onClick={() => onSelectRecord(record)}>
                  {[...shownFields.entries()].map(([fieldName, field]) => (
                    <td key={fieldName}>
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
                    <td key={fieldName}>
                      {sums[fieldName]}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </>
      ))}
    </>
  )
}
