import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { ViewComponentProps } from '../types/view-component-props';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import { FieldValue } from './field-value';
import s from './board.module.css'

export const Board: FunctionComponent<ViewComponentProps> = ({
  config,
  fields,
  records,
}) => {
  const groups = useMemo(() => {
    return createViewGroups({ fields, records }, config)
  }, [fields, records, config])
  const shownFields = getShownFields({ fields, records }, config)

  return (
    <div className={s.container}>
      {groups.map(group => (
        <div key={group.id} className={s.column}>
          <p>{group.title}</p>
          {group.records.map(record => (
            <div className="card">
              <div className="card-body">
                {[...shownFields.entries()].map(([fieldName, field]) => (
                  <FieldValue
                    key={fieldName}
                    value={record[fieldName]}
                    field={field}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
