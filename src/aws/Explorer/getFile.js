import authFetch, { is2XX } from '../authFetch';
import resolvePath from './resolvePath';
import ObjectType from './ObjectType';

export const NOT_DEFINED_DATA_TYPE = 'not defined data type';

export default function getFile(path, objectType) {
  // TODO use S3 getObject for public files.
  const url = resolvePath(path, objectType);
  return authFetch(url)
  .then((response) => {
    if (!is2XX(response)) {
      throw new Error(response.statusText);
    }
    if (objectType === ObjectType.PUBLIC_FILE
      || objectType === ObjectType.DRAFT_FILE) {
      return response.text();
    }
    if (objectType === ObjectType.IMAGE_FILE) {
      return response.blob();
    }
    throw new Error(NOT_DEFINED_DATA_TYPE);
  });
}
