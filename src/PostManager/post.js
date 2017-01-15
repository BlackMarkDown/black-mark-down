import { getBucket } from './bucket';

function post(title, content) {
  return getBucket().upload({
    Key: title,
    Body: content,
    ACL: 'public-read',
  }).promise();
}

export default post;
