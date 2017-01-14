import uuid from 'uuid';
import s3 from './s3Instance';

function uploadImage(name, file) {
  const key = `${name}_${uuid()}`;

  return s3.upload({
    Key: key,
    Body: file,
    ACL: 'public-read',
  }).promise();
}

export default uploadImage;
