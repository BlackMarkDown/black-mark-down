import putObject from '../Explorer/putObject';
import ObjectType from '../Explorer/ObjectType';

function post(filePath, content) {
  return putObject(filePath, ObjectType.PUBLIC_FILE, content);
}

export default post;
