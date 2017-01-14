import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import userPool from './userPool';

const logIn = (username, password) => new Promise((resolve, reject) => {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: resolve,
    onFailure: err => reject(err),
  });
});

export default logIn;
