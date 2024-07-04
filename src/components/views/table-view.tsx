import { FunctionComponent } from 'preact';
import { FieldValue } from '../common/field-value';
import { ViewComponentProps } from '../../types/view-component-props';
import { getSums } from '../../utils/get-sums';
import { useView } from '../../hooks/use-view';

export const TableView: FunctionComponent<ViewComponentProps> = ({
  database,
  config,
  onSelectRecord,
}) => {
  const {
    groups,
    renderRules,
    shownFields,
  } = useView(database, config)
  const [hasSums, sums] = getSums(database, config)

  return (
    <div className={groups.length > 1 ? 'mt-8' : 'mt-6'}>
      {groups.map(table => (
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
                {shownFields.map((field) => (
                  <th key={field.name} scope="col" className="text-left">
                    <span className="text-body-secondary">
                      {field.name}
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
                  {shownFields.map(field => (
                    <td
                      key={field.name}
                      className={`
                        h-10
                        text-content-secondary
                        first:text-content
                        first:group-hover:text-primary
                      `}
                    >
                      <FieldValue
                        value={record[field.name]}
                        field={field}
                        render={renderRules[field.name]}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {hasSums && (
              <tfoot>
                <tr>
                  {[...shownFields.keys()].map((fieldName) => (
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
