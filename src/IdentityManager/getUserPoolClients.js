import AWS from 'aws-sdk';

function getCognitoIdentityServiceProvider() {
  return new AWS.CognitoIdentityServiceProvider();
}

const getUserPoolClients = (maxResults, nextToken) => new Promise((resolve, reject) => {
  const params = {
    UserPoolId: __AWS_COGNITO_USER_POOL_ID__,
    MaxResults: maxResults,
    NextToken: nextToken,
  };

  const cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

  cognitoIdentityServiceProvider.listUserPoolClients(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data);
  });
});

export default getUserPoolClients;
