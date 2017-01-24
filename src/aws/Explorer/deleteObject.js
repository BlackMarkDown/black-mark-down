import resolvePath from './resolvePath';
import authFetch, { is2XX } from '../authFetch';

export const FAILED_TO_DELETE_FILE = 'Failed to delete file';

export default function deleteObject(path, objectType) {
  const url = resolvePath(path, objectType);
  return authFetch(url, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!is2XX(response)) {
      throw new Error(FAILED_TO_DELETE_FILE);
    }
  });
}
