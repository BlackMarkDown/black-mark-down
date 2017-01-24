import ObjectType from '../Explorer/ObjectType';
import putObject from '../Explorer/putObject';
import deleteObject from '../Explorer/deleteObject';

// TODO support changing filename
export default function saveWhileEditing(filePath, content, newFilePath) {
  if (newFilePath) {
    return putObject(newFilePath, ObjectType.DRAFT_FILE, content)
    .then(() => deleteObject(filePath, ObjectType.DRAFT_FILE));
  }
  return putObject(filePath, ObjectType.DRAFT_FILE, content);
}
