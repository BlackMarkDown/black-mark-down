'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // TODO remove this later
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');
const contentTypeParser = require('content-type').parse;

AWS.config.region = process.env.AWS_REGION;

const bucket = new AWS.S3({
  params: {
    Bucket: process.env.AMAZON_S3_BUCKET_NAME,
  },
});

const app = express();

app.use(cors());
app.use((req, res, next) => {
  try {
    console.log(req.headers);
    const contentType = contentTypeParser(req.headers['content-type']);
    console.log(contentType);
    if (contentType.type !== 'application/octet-stream') {
      next();
      return;
    }
    const data = [];
    req.on('data', (chunk) => {
      console.log('data');
      console.log(chunk);
      data.push(chunk);
    });
    req.on('end', () => {
      console.log('end');
      console.log(data);
      console.log(JSON.stringify(data));
      console.log(data.length);
      req.body = new Buffer(data.toString(), 'base64');
      console.log(req.body);
      next();
    });
  } catch (err) {
    console.log(err);
    next();
  }
});
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

function getKeyFromPath(path) {
  const key = path.charAt(0) === '/' ? path.substr(1) : path;
  return decodeURIComponent(key);
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
  const pathParts = req.path.split('/').splice(1); // remove first '/' by splicing
  const filename = pathParts[pathParts.length - 1];

  let acl;
  if (filename.indexOf('draft-') === 0) {
    acl = 'private';
  } else {
    acl = 'public-read';
  }
/*

for(var i = 0; i < a.toString().length; i++) {
  console.log(a.toString().charCodeAt(i));
}

for(var i = 0; i < Math.max(a.toString().length, b.toString().length); i++) {
  if (i >= b.toString().length) {
    console.log(i, a.toString().charCodeAt(i));
  }
  else if (a.toString().charCodeAt(i) !== b.toString().charCodeAt(i)) {
    console.log(i, '!!', a.toString().charCodeAt(i), b.toString().charCodeAt(i))
  } else {
    console.log(i, a.toString().charCodeAt(i));
  }
}*/

  console.log(req.body);
  console.log(JSON.stringify(req.body));
  console.log(req.body.length);
  console.log(req.body.toString());
  console.log(req.body.toString('base64'));
  console.log(req.headers);
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
