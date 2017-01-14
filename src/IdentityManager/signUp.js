import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userPool from './userPool';

const signUp = (username, email, password) => new Promise((resolve, reject) => {
  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Value: email,
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, (err) => {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
});

export default signUp;
