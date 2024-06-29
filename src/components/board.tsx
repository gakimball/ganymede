import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { ViewComponentProps } from '../types/view-component-props';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import { FieldValue } from './field-value';
import { getRenderRules } from '../utils/get-render-rules';
import s from './board.module.css'

export const Board: FunctionComponent<ViewComponentProps> = ({
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
    <div className={s.container}>
      {groups.map(group => (
        <div key={group.id} className={s.column}>
          <span className="badge text-bg-primary mt-3 mb-3">
            {group.title}
          </span>
          {group.records.map(record => (
            <div className={`${s.card} card mb-3`} onClick={() => onSelectRecord(record)}>
              <div className="card-body">
                {[...shownFields.entries()].map(([fieldName, field]) => (
                  <div key={fieldName}>
                    <FieldValue
                      value={record[fieldName]}
                      field={field}
                      render={renderRules[fieldName]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
