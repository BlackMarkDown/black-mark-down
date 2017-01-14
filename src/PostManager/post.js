import s3 from './s3Instance';

function post(title, content) {
  return s3.upload({
    Key: title,
    Body: content,
    ACL: 'public-read',
  }).promise();
}

export default post;
