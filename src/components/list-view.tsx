import { Fragment, FunctionComponent } from 'preact';
import { ViewComponentProps } from '../types/view-component-props';
import { useMemo } from 'preact/hooks';
import { createViewGroups } from '../utils/create-view-groups';
import { getShownFields } from '../utils/get-shown-fields';
import { getRenderRules } from '../utils/get-render-rules';
import { FieldValue } from './field-value';
import s from './list-view.module.css'

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
  const renderRules = getRenderRules(config, fields)

  return (
    <>
      {lists.map(list => (
        <div key={list.title} className="mt-8 pb-3 pe-3">
          {list.title && list.field && (
            <div className="mb-4">
              <FieldValue value={list.title} field={list.field} />
            </div>
          )}
          {list.records.map(record => (
            <div
              className="flex gap-3 mt-3 group cursor-pointer"
              style={{ height: '29px' }}
              onClick={() => onSelectRecord(record)}
            >
              {[...shownFields.entries()].map(([fieldName, field]) => (
                record[fieldName] && (
                  <div
                    key={fieldName}
                    className={`
                      text-content-secondary
                      first:text-content
                      first:group-hover:text-primary
                      first:flex-1
                    `}
                  >
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
