import authFetch, { is2XX } from '../authFetch';

function getFile(url) {
  // TODO use S3 getObject for public files.
  return authFetch(url)
  .then((response) => {
    if (!is2XX(response)) {
      return response.text();
    }
    throw new Error(response.statusText);
  });
}

export default getFile;
