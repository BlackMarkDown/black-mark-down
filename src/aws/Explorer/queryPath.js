import bucket from '../bucket';
import resolvePath, { prefixes } from './resolvePath';
import ObjectType from './ObjectType';
/**
  * @return: {
  *   files: [ file, file, ... ],
  *   folders: [ folder, folder, ...]
  * }
  * file: {
  *   name,
  * }
  * folder: {
  *   name,
  * }
  */
export default function queryPath(path, continuationToken) {
  const resolvedPath = resolvePath(path, ObjectType.FOLDER);
  const params = {
    ContinuationToken: continuationToken,
    Delimiter: '/',
    Prefix: resolvedPath,
  };
  const publicFilePrefix = `${resolvedPath}${prefixes[ObjectType.PUBLIC_FILE]}`;

  return bucket.listObjectsV2(params)
  .promise()
  .then((data) => {
    const files = data.Contents
    .filter(content =>
      content.Key.indexOf(publicFilePrefix) === 0
    )
    .map(content => ({
      name: content.Key.substring(publicFilePrefix.length),
    }));

    const folders = data.CommonPrefixes
    .map(commonPrefix => ({
      name: commonPrefix.Prefix.substring(
        resolvedPath.length,
        commonPrefix.Prefix.length - 1
      ),
    }));
    return {
      files,
      folders,
    };
  });
}
