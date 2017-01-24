import createObjectIfNotExists from '../Explorer/createObjectIfNotExists';
import ObjectType from '../Explorer/ObjectType';

function post(filePath, content) {
  return createObjectIfNotExists(filePath, ObjectType.PUBLIC_FILE, content);
}

export default post;
