import { FunctionComponent } from 'preact';
import { ViewComponentProps } from '../../types/view-component-props';
import { FieldValue } from '../common/field-value';
import { useView } from '../../hooks/use-view';
import { FieldValueSet } from '../common/field-value-set';

export const BoardView: FunctionComponent<ViewComponentProps> = ({
  database,
  config,
  onSelectRecord,
}) => {
  const {
    groups,
    renderRules,
    shownFields,
  } = useView(database, config)

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto mt-8">
      {groups.map(group => (
        <div key={group.id} className="grow-0 shrink-0 basis-64">
          {group.field && (
            <FieldValue value={group.title} field={group.field} />
          )}
          {group.records.map(record => (
            <div
              className={`
                p-2 mt-4
                border-1 border-border rounded-lg
                bg-background-secondary
                ${config.aggregate ? '' : 'cursor-pointer'}
                hover:border-content-secondary
                group
              `}
              onClick={() => {
                if (!config.aggregate) {
                  onSelectRecord(record)
                }
              }}
            >
              {shownFields.map((field) => (
                <div
                  key={field.name}
                  className={`
                    text-content-secondary
                    first:text-content
                  `}
                >
                  <FieldValueSet
                    value={record[field.name]}
                    field={field}
                    render={renderRules[field.name]}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
