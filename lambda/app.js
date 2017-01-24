'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // TODO remove this later
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');

AWS.config.region = process.env.AWS_REGION;

const bucket = new AWS.S3({
  params: {
    Bucket: process.env.AMAZON_S3_BUCKET_NAME,
  },
});

const app = express();

app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

function getKeyFromPath(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}

app.use((req, res, next) => {
  try {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    req.username = req.apiGateway.event.requestContext.authorizer.claims['cognito:username'];
    const path = req.path;
    const pathParts = path.split('/').splice(1); // remove first '/' by splicing
    if (pathParts[0] !== req.username) {
      return res.sendStatus(401);
    }
    console.log(req.method, path, getKeyFromPath(path));
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
});

app.head('*', (req, res) => {
  const key = getKeyFromPath(req.path);
  return bucket.headObject({
    Key: key,
  })
  .promise()
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(err.statusCode || 403);
  });
});

app.get('*', (req, res) => {
  const key = getKeyFromPath(req.path);
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
  const key = getKeyFromPath(req.path);
  console.log(req.body);
  const isBodyEmpty = (!req.body)
    || (req.body.constructor === Object
      && Object.keys(req.body).length === 0);

  return bucket.putObject({
    Key: key,
    Body: isBodyEmpty ? null : req.body,
  })
  .promise()
  .then(() => res.sendStatus(200))
  .catch((err) => {
    console.log(err);
    res.sendStatus(err.statusCode || 403);
  });
});

app.delete('*', (req, res) => {
  const key = getKeyFromPath(req.path);

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

module.exports = app;
