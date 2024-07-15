import { FunctionComponent } from 'preact';
import { ViewComponentProps } from '../../types/view-component-props';
import { FieldValue } from '../common/field-value';
import { useView } from '../../hooks/use-view';
import { GroupTitle } from '../common/group-title';

export const ListView: FunctionComponent<ViewComponentProps> = ({
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
    <>
      {groups.filter(list => list.records.length > 0).map(list => (
        <div key={list.title} className="mt-8 pb-3 pe-3">
          {list.title && list.field && (
            <div className="mb-4 flex items-center gap-3">
              <GroupTitle title={list.title} field={list.field} />
              <span className="text-content-secondary">
                {list.records.length}
              </span>
            </div>
          )}
          {list.records.map(record => (
            <div
              className="flex gap-3 mt-3 group cursor-pointer h-[29px]"
              onClick={() => onSelectRecord(record)}
            >
              {shownFields.map((field) => (
                record[field.name] && (
                  <div
                    key={field.name}
                    className={`
                      text-content-secondary
                      first:text-content
                      first:group-hover:text-primary
                      first:flex-1
                    `}
                  >
                    <FieldValue
                      value={record[field.name]}
                      field={field}
                      render={renderRules[field.name]}
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
