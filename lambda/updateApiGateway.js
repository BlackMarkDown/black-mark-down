#!/usr/bin/env node
'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({ region: process.env.REGION });

const API_GATEWAY_API = 'ApiGatewayApi';
const cloudFormation = new AWS.CloudFormation();
const apiGateway = new AWS.APIGateway();

function getApiGatewayRestApiId(stackName, logicalResourceId) {
  const recursion = (nextToken) => {
    const params = {
      StackName: stackName,
      NextToken: nextToken,
    };
    return cloudFormation.listStackResources(params)
    .promise()
    .then((data) => {
      const apiGatewayApi = data.StackResourceSummaries.find(stackResourceSummary =>
        stackResourceSummary.LogicalResourceId === logicalResourceId
      );
      if (!apiGatewayApi) {
        if (!data.NextToken) {
          throw new Error(`No resource ${logicalResourceId} on stack ${stackName}`);
        }
        return recursion(data.NextToken);
      }
      return apiGatewayApi.PhysicalResourceId;
    });
  };
  return recursion();
}

function updateApiGateway(restApiId) {
  const body = fs.readFileSync(path.join(__dirname, 'simple-proxy-api.yaml'));
  const params = {
    body,
    restApiId,
    failOnWarnings: true,
    mode: 'overwrite',
  };
  return apiGateway.putRestApi(params)
  .promise()
  .then(() => apiGateway.createDeployment({
    restApiId,
    stageName: 'prod',
  }).promise());
}

getApiGatewayRestApiId(process.env.STACK_NAME, API_GATEWAY_API)
.then(id => updateApiGateway(id))
.then(() => console.log('Successfully Completed'))
.catch(err => console.error(err));
