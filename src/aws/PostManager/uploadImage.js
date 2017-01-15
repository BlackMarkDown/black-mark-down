import uuid from 'uuid';
import { getBucket } from '../bucket';

function uploadImage(name, file) {
  const key = `${name}_${uuid()}`;

  return getBucket().upload({
    Key: key,
    Body: file,
    ACL: 'public-read',
  }).promise();
}

export default uploadImage;
