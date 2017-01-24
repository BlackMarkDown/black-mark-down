import resolvePath from './resolvePath';
import authFetch, { is2XX } from '../authFetch';
import putObject from './putObject';

export const FILE_ALREADY_EXISTS = 'File already exists';
/**
  * @return Promise that return path
  */
export default function createObjectIfNotExists(path, objectType, content) {
  const url = resolvePath(path, objectType);
  return authFetch(url, {
    method: 'HEAD',
  })
  .then((response) => {
    if (is2XX(response)) {
      throw new Error(FILE_ALREADY_EXISTS);
    }
  })
  .then(() => putObject(path, objectType, content));
}
