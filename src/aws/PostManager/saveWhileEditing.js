import ObjectType from '../Explorer/ObjectType';
import putObject from '../Explorer/putObject';

// TODO support changing filename
export default function saveWhileEditing(filePath, content) {
  return putObject(filePath, ObjectType.DRAFT_FILE, content);
}
