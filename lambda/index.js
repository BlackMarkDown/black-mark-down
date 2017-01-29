'use strict';

const awsServerlessExpress = require('aws-serverless-express');
const app = require('./src/app');

const server = awsServerlessExpress.createServer(app, null, ['application/octet-stream']);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
