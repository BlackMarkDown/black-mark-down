import s3Fetch, { is2XX } from '../s3Fetch';
import authFetch from '../authFetch';
import resolvePath from './resolvePath';
import ObjectType from './ObjectType';

export default function getFile(path, objectType) {
  const resolvedPath = resolvePath(path, objectType);
  const fetch = (
    objectType === ObjectType.DRAFT_FILE
    ? authFetch
    : s3Fetch
  );
  return fetch(resolvedPath)
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
