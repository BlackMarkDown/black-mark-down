import resolvePath from './resolvePath';
import authFetch, { is2XX } from '../authFetch';

/**
  * @return Promise that return path
  */
export default function putObject(path, objectType, content) {
  const url = resolvePath(path, objectType);
  return authFetch(url, {
    method: 'PUT',
    body: content,
  })
  .then((response) => {
    if (is2XX(response)) {
      return path;
    }
    throw new Error(response.statusText);
  });
}
