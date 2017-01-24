import AWS from 'aws-sdk';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import userPool from './userPool';
import { refreshBucket } from '../bucket';
import { refreshDocumentClients } from '../documentClients';
import { updateToken } from '../authFetch';
import { updateUsername } from './getUsername';

export const MFA_REQUIRED = 'MFA Required';
export const NEW_PASSWORD_REQUIRED = 'New Password Required';


const logIn = (username, password, {
  mfaRequired,
  newPasswordRequired,
} = {}) => new Promise((resolve, reject) => {
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
    onSuccess: (result) => {
      const token = result.getIdToken().getJwtToken();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
        Logins: {
          [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`]: token,
        },
      });
      refreshBucket();
      refreshDocumentClients();
      updateToken(token);
      updateUsername(username);
      resolve(result);
    },
    onFailure: err => reject(err),
    mfaRequired:
      codeDeliveryDetails => (
        mfaRequired
        ? mfaRequired(codeDeliveryDetails, cognitoUser)
        : reject(new Error(MFA_REQUIRED))
      ),
    newPasswordRequired:
      (userAttributes, requiredAttributes) => (
        newPasswordRequired
        ? newPasswordRequired(userAttributes, requiredAttributes, cognitoUser)
        : reject(new Error(NEW_PASSWORD_REQUIRED))
      ),
  });
});

export default logIn;
