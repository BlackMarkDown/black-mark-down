import moment from 'moment';
import urlJoin from 'url-join';
import authFetch, { is2XX } from '../authFetch';

export const FILE_ALREADY_EXISTS = 'File already exists';
/**
  * @return Promise that return path
  */
export default function init(directoryPath) {
  const tempFilename = `임시저장-${moment().format('YYYY-MM-DD_HH-mm-ss')}`;
  const path = urlJoin(directoryPath, tempFilename);
  const url = urlJoin(process.env.AMAZON_API_GATEWAY_URL, path);
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
