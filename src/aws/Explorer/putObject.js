import resolvePath from './resolvePath';
import authFetch, { is2XX } from '../authFetch';
import ObjectType from './ObjectType';


const contentType = {
  [ObjectType.FOLDER]: null,
  [ObjectType.PUBLIC_FILE]: 'text/plain;charset=UTF-8',
  [ObjectType.DRAFT_FILE]: 'text/plain;charset=UTF-8',
  [ObjectType.IMAGE_FILE]: 'application/octet-stream',
};

/**
  * @return Promise that return path
  */
export default function putObject(path, objectType, content) {
  console.log(contentType[objectType]);
  const url = resolvePath(path, objectType);
  return authFetch(url, {
    method: 'PUT',
    body: content,
    headers: {
      'Content-Type': contentType[objectType],
    },
  })
  .then((response) => {
    if (is2XX(response)) {
      return path;
    }
    throw new Error(response.statusText);
  });
}
