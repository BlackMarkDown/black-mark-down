import AWS from 'aws-sdk';

const s3Instance = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: __AMAZON_S3_BUCKET_NAME__,
  },
});

export default s3Instance;
