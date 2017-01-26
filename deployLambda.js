const env = require('./config/dev.env');

Object.keys(env).forEach((key) => {
  env[key] = eval(`(${env[key]})`);
});

process.env = Object.assign(process.env, env);

const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const moment = require('moment');


const src = `${__dirname}/lambda/`;
const dest = path.join(__dirname, 'archive.zip');

const output = fs.createWriteStream(dest);

const archive = archiver('zip', {
  store: true,
});
archive.pipe(output);

output.on('close', () => {
  console.log('zip success');

  const zip = fs.readFileSync(dest);
  console.log('load zip file success');

  const bucket = new AWS.S3({
    params: {
      Bucket: process.env.AMAZON_S3_DEPLOY_BUCKET_NAME,
    },
  });

  const key = `${moment().format()}-${uuid()}`;
  bucket.putObject({
    Key: key,
    Body: zip,
  }).promise()
  .then(() => {
    const lambda = new AWS.Lambda({
      region: process.env.AWS_REGION,
    });
    lambda.updateFunctionCode({
      FunctionName: 'test',
      Publish: true,
      S3Bucket: process.env.AMAZON_S3_DEPLOY_BUCKET_NAME,
      S3Key: key,
    }).promise()
    .then(data => console.log(data))
    .catch(err => console.log(err, err.stack));
  });
});

// good practice to catch this error explicitly
archive.on('error', (err) => {
  throw err;
});

archive.directory(src, '');

archive.finalize();
