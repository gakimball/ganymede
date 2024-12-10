import { Fragment, FunctionComponent } from 'preact';
import { ViewComponentProps } from '../../types/view-component-props';
import { useView } from '../../hooks/use-view';
import { GroupTitle } from '../common/group-title';
import { DatabaseFieldType } from '../../types/database';
import { FieldValue } from '../common/field-value';

export const RecordView: FunctionComponent<ViewComponentProps> = ({
  database,
  config,
}) => {
  const {
    groups,
    renderRules,
  } = useView(database, config)

  return (
    <>
      {groups.filter(group => group.records.length > 0).map(group => (
        <div key={group.id} className="mt-8 pb-3 pe-3">
          {group.title && group.field && (
            <div className="mb-4">
              <GroupTitle title={group.title} field={group.field} />
            </div>
          )}
          <div className="grid gap-x-4 gap-y-3 grid-cols-[max-content_1fr]">
            {group.records.map((record, index) => (
              <Fragment key={index}>
                {Object.entries(record).flatMap(([fieldName, value]) => {
                  if (fieldName === group.field?.name) {
                    return
                  }

                  const field = database.fields.get(fieldName) ?? {
                    name: fieldName,
                    type: DatabaseFieldType.STRING,
                  }

                  return value?.map((item, index) => (
                    <Fragment key={fieldName + index}>
                      <div className="text-content-secondary text-right">
                        {fieldName.replace(/_/g, ' ')}
                      </div>
                      <FieldValue
                        value={item}
                        field={field}
                        render={renderRules[fieldName]}
                      />
                    </Fragment>
                  ))
                })}
                <div></div>
                <div></div>
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
