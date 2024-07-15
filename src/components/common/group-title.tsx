import { FunctionComponent } from 'preact';
import { DatabaseField, DatabaseFieldType } from '../../types/database';
import { EnumTag } from './enum-tag';
import { Tag } from './tag';

interface GroupTitleProps {
  title: string;
  field: DatabaseField;
}

export const GroupTitle: FunctionComponent<GroupTitleProps> = ({
  title,
  field,
}) => {
  if (field.type === DatabaseFieldType.ENUM) {
    return <EnumTag value={title} field={field} />
  }

  return <Tag color="#555">{title}</Tag>
}
