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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());
app.use((req, res, next) => {
  try {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    req.username = req.apiGateway.event.requestContext.authorizer.claims['cognito:username'];
    next();
  } catch (err) {
    res.end(401);
  }
});

app.get('*', (req, res) => {
  const path = req.path;
  const pathParts = path.split('/').splice(1);
  if (pathParts[0] !== req.username) {
    return res.sendStatus(401);
  }
  const key = req.path.charAt(0) === '/' ? req.path.substr(1) : req.path;
  return bucket.getObject({
    Key: key,
  })
  .promise()
  .then(data => res.send(data.Body))
  .catch((err) => {
    console.log(err);
    res.sendStatus(404);
  });
});

module.exports = app;
