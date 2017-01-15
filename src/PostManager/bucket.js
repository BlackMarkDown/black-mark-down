import AWS from 'aws-sdk';

AWS.config.setPromisesDependency(Promise);

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
