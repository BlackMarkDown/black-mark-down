import resolvePath from './resolvePath';
import authFetch, { is2XX } from '../authFetch';

export const FILE_ALREADY_EXISTS = 'File already exists';
/**
  * @return Promise that return path
  */
export default function createObjectIfNotExists(path, objectType) {
  const url = resolvePath(path, objectType);
  return authFetch(url, {
    method: 'HEAD',
  })
  .then((response) => {
    if (is2XX(response)) {
      throw new Error(FILE_ALREADY_EXISTS);
    }
  })
  .then(() => authFetch(url, {
    method: 'PUT',
  }))
  .then((response) => {
    if (is2XX(response)) {
      return path;
    }
    throw new Error(response.statusText);
  });
}
