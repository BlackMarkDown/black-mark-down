import urlJoin from 'url-join';
import authFetch, { is2XX } from '../authFetch';
import resolvePath from './resolvePath';

function getFile(path, objectType) {
  // TODO use S3 getObject for public files.
  const url = resolvePath(path, objectType);
  return authFetch(url)
  .then((response) => {
    if (!is2XX(response)) {
      throw new Error(response.statusText);
    }
    return response.text();
  });
}

export default getFile;
