import uuid from 'uuid';
import { uploadFileToS3 } from '../bucket';
/**
  *
  * @return Promise with url to view uploaded image
  */
function uploadImage(name, file) {
  const key = `${name}_${uuid()}`;

  return uploadFileToS3(key, file);
}

export default uploadImage;
