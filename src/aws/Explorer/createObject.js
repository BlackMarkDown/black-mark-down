import resolveURLToS3Key from './resolveURLToS3Key';
import { isObjectExisting, uploadFileToS3 } from '../bucket';

/**
  * Create object if not exists.
  * But, actually we can't guarantee because we can't handle consistency.
  */
export default function createObject(url, objectType, content) {
  const key = resolveURLToS3Key(url, objectType);
  return isObjectExisting(key)
  .then((isExisting) => {
    if (!isExisting) {
      throw new Error(`Already Exists in ${url}`);
    }
    return uploadFileToS3(key, content, 'private');
  });
}
