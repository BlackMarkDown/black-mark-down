'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // TODO remove this later
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const morgan = require('morgan');
const bodyParserBase64 = require('./bodyParserBase64');
const cognitoAuthorizationMiddleware = require('./cognitoAuthorizationMiddleware');

AWS.config.region = process.env.AWS_REGION;

const bucket = new AWS.S3({
  params: {
    Bucket: process.env.AMAZON_S3_BUCKET_NAME,
  },
});

const app = express();

const getS3KeyFromPath = () => (req, res, next) => {
  const path = req.path;
  const key = path.charAt(0) === '/' ? path.substr(1) : path;
  /* eslint no-param-reassign: "off" */
  req.S3Key = decodeURIComponent(key);
  next();
};

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParserBase64());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cognitoAuthorizationMiddleware());
app.use(getS3KeyFromPath());
app.use((req, res, next) => {
  console.log('after middleware');
  next();
});

function getPathParts(req) {
  // remove first '/' by splicing
  const pathParts = req.path.split('/').splice(1);
  return pathParts;
}

function isDraftFile(req) {
  const pathParts = getPathParts(req);
  const filename = pathParts[pathParts.length - 1];
  return filename.indexOf('draft-') === 0;
}

function isOwner(req) {
  const pathParts = getPathParts(req);
  const username = pathParts[0];
  console.log(username, req.username);

  return username === req.username;
}

app.head('*', (req, res) => {
  const key = req.S3Key;
  console.log(key);
  return bucket.headObject({
    Key: key,
  })
  .promise()
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    res.sendStatus(err.statusCode || 403);
  });
});

app.get('*', (req, res) => {
  if (isDraftFile(req) && !isOwner(req)) {
    console.log("it's draft file but this user isn't owner");
    return res.sendStatus(401);
  }
  const key = req.S3Key;
  console.log(key);
  return bucket.getObject({
    Key: key,
  })
  .promise()
  .then(data => res.send(data.Body))
  .catch((err) => {
    console.log(err);
    res.sendStatus(err.statusCode || 403);
  });
});

app.put('*', (req, res) => {
  if (!isOwner(req)) {
    console.log('not owner');
    return res.sendStatus(401);
  }

  const key = req.S3Key;
  const acl = 'public-read'; // TODO make private on draft files

  const isBodyEmpty = (!req.body)
    || (req.body.constructor === Object
      && Object.keys(req.body).length === 0);

  return bucket.putObject({
    Key: key,
    Body: isBodyEmpty ? null : req.body,
    ACL: acl,
  })
  .promise()
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(err.statusCode || 403);
  });
});

app.delete('*', (req, res) => {
  if (!isOwner(req)) {
    return res.sendStatus(401);
  }
  const key = req.S3Key;
  return bucket.deleteObject({
    Key: key,
  })
  .promise()
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(err.statusCode || 403);
  });
});

app.use((err, req, res, next) => {
  console.log(err, err.stack);
  next();
});

module.exports = app;
