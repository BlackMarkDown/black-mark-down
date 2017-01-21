import AWS from 'aws-sdk';
import getUsername from './IdentityManager/getUsername';

AWS.config.region = process.env.AWS_REGION;

let bucket;

export function refreshBucket() {
  bucket = new AWS.S3({
    params: {
      Bucket: process.env.AMAZON_S3_BUCKET_NAME,
    },
  });
}
refreshBucket();

export function getBucket() {
  return bucket;
}

export function uploadFileToS3(key, body, ACL) {
  return getBucket().upload({
    Key: `${getUsername()}/${key}`,
    Body: body,
    ACL: ACL || 'public-read',
  }).promise().then(data => data.Location);
}

export function isObjectExisting(key) {
  return bucket.headObject({
    Key: key,
  }).promise()
  .then(() => true)
  .catch((err) => {
    console.log(err);
    return false;
  });
}
