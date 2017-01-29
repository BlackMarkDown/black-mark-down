import s3Fetch, { is2XX } from '../s3Fetch';
import resolvePath from './resolvePath';
import ObjectType from './ObjectType';

export default function getFile(path, objectType) {
  const resolvedPath = resolvePath(path, objectType);
  return s3Fetch(resolvedPath)
  .then((response) => {
    if (!is2XX(response)) {
      throw new Error(response.statusText);
    }
    if (objectType === ObjectType.IMAGE_FILE) {
      return response.blob();
    }
    return response.text();
  });
}
