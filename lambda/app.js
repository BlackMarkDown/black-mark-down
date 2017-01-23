'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // TODO remove this later
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

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

app.get('/', (req, res) => {
  res.json({
    username: req.username,
  });
});

module.exports = app;
