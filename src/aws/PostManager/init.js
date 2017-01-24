import moment from 'moment';
import urlJoin from 'url-join';
import createObjectIfNotExists from '../Explorer/createObjectIfNotExists';
import ObjectType from '../Explorer/ObjectType';

export const FILE_ALREADY_EXISTS = 'File already exists';
/**
  * @return Promise that return path
  */
export default function init(directoryPath) {
  const tempFilename = `임시저장-${moment().format('YYYY-MM-DD_HH-mm-ss')}`;
  const path = urlJoin(directoryPath, tempFilename);
  return createObjectIfNotExists(path, ObjectType.DRAFT_FILE).then(() => path);
}
