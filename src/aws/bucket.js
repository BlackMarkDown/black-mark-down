import AWS from 'aws-sdk';

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
    Key: `${AWS.config.credentials.identityId}/${key}`,
    Body: body,
    ACL: ACL || 'public-read',
  }).promise().then(data => data.Location);
}
