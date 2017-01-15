import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from './userPool';

const verifyEmail = (username, verificationCode) => new Promise((resolve, reject) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
    if (err) {
      return reject(err);
    }
    return resolve(result);
  });
});

export default verifyEmail;
