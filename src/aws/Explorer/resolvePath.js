import ObjectType from './ObjectType';

const prefixes = {
  [ObjectType.FOLDER]: '',
  [ObjectType.PUBLIC_FILE]: 'public-',
  [ObjectType.DRAFT_FILE]: 'draft-',
};

export function getPrefix(objectType) {
  if (Object.hasOwnProperty.call(prefixes, objectType)) {
    return prefixes[objectType];
  }
  throw new Error(`wrong object type : ${objectType}`);
}

const suffixes = {
  [ObjectType.FOLDER]: '/',
  [ObjectType.PUBLIC_FILE]: '',
  [ObjectType.DRAFT_FILE]: '',
};

export function getSuffix(objectType) {
  if (Object.hasOwnProperty.call(suffixes, objectType)) {
    return suffixes[objectType];
  }
  throw new Error(`wrong object type : ${objectType}`);
}

/**
  * @param path
  * path is like
  * /abc/def/ --> abc/def/{objecttype-} --> Throw Error
  * /abc/def --> abc/{objecttype-}def
  * abc/def/ --> abc/def/{objecttype-} --> Throw Error
  * abc/def --> abc/{objecttype-}def
  *
  * @param objectType
  *
  *
  */

export default function resolvePath(path, objectType) {
  if (objectType !== ObjectType.FOLDER && path.charAt(path.length - 1) === '/') {
    throw new Error("Only folder can have '/' suffix");
  }
  const strings = path.split('/').filter(string => string);
  return strings.reduce((accumulator, string, index) => {
    const isLastString = (index === strings.length - 1);
    if (isLastString) {
      return `${accumulator}/${getPrefix(objectType)}${string}${getSuffix(objectType)}`;
    }
    return `${accumulator}/${string}`;
  }, process.env.AMAZON_API_GATEWAY_URL);
}
