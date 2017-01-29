import ObjectType from '../Explorer/ObjectType';
import createObjectIfNotExists from '../Explorer/createObjectIfNotExists';

/**
  * @return Promise that return file path
  */
export default function uploadImage(filename, file) {
  return createObjectIfNotExists(filename, ObjectType.IMAGE_FILE, file);
}
