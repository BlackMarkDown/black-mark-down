import AWS from 'aws-sdk';

AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
});

/**
  * If you need Authorization to access bucket, renew bucket object on log-in function.
  * below bucket has Unauthenticated Identity.
  */

const bucket = new AWS.S3({
  params: {
    Bucket: process.env.AMAZON_S3_BUCKET_NAME,
  },
});

export default bucket;

export function getObject(path) {
  return bucket.getObject({
    Key: path,
  })
  .promise()
  .then(data => data.Body);
}
