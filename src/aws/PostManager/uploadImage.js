import uuid from 'uuid';
import { getBucket } from '../bucket';
/**
  *
  * @return Promise with url to view uploaded image
  */
function uploadImage(name, file) {
  const key = `${name}_${uuid()}`;

  return getBucket().upload({
    Key: key,
    Body: file,
    ACL: 'public-read',
  })
  .promise()
  .then(data => data.Location);
}

export default uploadImage;
