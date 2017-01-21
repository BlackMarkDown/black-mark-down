import ObjectType from './ObjectType';

const prefixes = {
  [ObjectType.FOLDER]: 'folder-',
  [ObjectType.PUBLIC_FILE]: 'public-',
  [ObjectType.DRAFT_FILE]: 'draft-',
};

export function getPrefix(objectType) {
  const ret = prefixes[objectType];
  if (!ret) {
    throw new Error(`wrong object type : ${objectType}`);
  }
  return ret;
}

export default function resolveURLToS3Key(url, objectType) {
  /**
    * URL Cases
    *
    * /abc/def/
    * /abc/def
    * abc/def/
    * abc/def
    *
    * Return value is like
    * /folder-abc/objecttype-def
    *
    */
  const strings = url.split('/').filter(string => string);
  return strings.reduce((accumulator, string, index) => {
    const isLastString = (index === strings.length - 1);
    const prefix = isLastString ? getPrefix(objectType) : getPrefix(ObjectType.FOLDER);
    return `${accumulator}/${prefix}${string}`;
  }, '');
}
