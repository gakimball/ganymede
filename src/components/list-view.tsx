import { Fragment, FunctionComponent } from 'preact';
import { ViewComponentProps } from '../types/view-component-props';
import { useMemo } from 'preact/hooks';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import { getRenderRules } from '../utils/get-render-rules';
import { FieldValue } from './field-value';

export const ListView: FunctionComponent<ViewComponentProps> = ({
  config,
  fields,
  records,
  directory,
  onSelectRecord,
}) => {
  const lists = useMemo(() => {
    return createViewGroups({ records, fields }, config)
  }, [records, fields, config])
  const shownFields = getShownFields({ fields, records }, config)
  const renderRules = getRenderRules(config)

  return (
    <>
      {lists.map(list => (
        <div key={list.title} className="mt-4 pb-3 pe-3 border-bottom">
          {list.title && config.Group && (
            <span className="badge text-bg-primary">
              {list.title}
            </span>
          )}
          {list.records.map(record => (
            <div
              className="d-flex gap-3 mt-3"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectRecord(record)}
            >
              {[...shownFields.entries()].map(([fieldName, field], index) => (
                record[fieldName] && (
                  <div key={fieldName} className={`${index === 0 ? 'flex-grow-1' : ''}`}>
                    <FieldValue
                      value={record[fieldName]}
                      field={field}
                      render={renderRules[fieldName]}
                    />
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
