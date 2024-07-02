import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { ViewComponentProps } from '../../types/view-component-props';
import { createViewGroups } from '../../utils/create-view-groups';
import { getShownFields } from '../../utils/get-shown-fields';
import { FieldValue } from '../common/field-value';
import { getRenderRules } from '../../utils/get-render-rules';

export const BoardView: FunctionComponent<ViewComponentProps> = ({
  config,
  fields,
  records,
  onSelectRecord,
}) => {
  const groups = useMemo(() => {
    return createViewGroups({ fields, records }, config)
  }, [fields, records, config])
  const shownFields = getShownFields({ fields, records }, config)
  const renderRules = getRenderRules(config, fields)

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto mt-8">
      {groups.map(group => (
        <div key={group.id} style={{ flex: '0 0 250px' }}>
          {group.field && (
            <FieldValue value={group.title} field={group.field} />
          )}
          {group.records.map(record => (
            <div
              className={`
                p-2 mt-4
                border-1 border-border rounded-lg
                bg-background-secondary
                cursor-pointer
                hover:border-content-secondary
                group
              `}
              onClick={() => onSelectRecord(record)}
            >
              {shownFields.map((field) => (
                <div
                  key={field.name}
                  className={`
                    text-content-secondary
                    first:text-content
                  `}
                >
                  <FieldValue
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
