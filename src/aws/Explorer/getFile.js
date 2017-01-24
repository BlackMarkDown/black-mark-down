import urlJoin from 'url-join';
import authFetch, { is2XX } from '../authFetch';

function getFile(path) {
  // TODO use S3 getObject for public files.
  const url = urlJoin(process.env.AMAZON_API_GATEWAY_URL, path);
  return authFetch(url)
  .then((response) => {
    if (!is2XX(response)) {
      throw new Error(response.statusText);
    }
    return response.text();
  });
}

export default getFile;
