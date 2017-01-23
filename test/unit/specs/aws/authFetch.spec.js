import logIn from 'src/aws/IdentityManager/logIn';
import authFetch from 'src/aws/authFetch';

describe('authFetch.js', () => {
  it('should success to fetch after log in', () => {
    const {
      username,
      password,
    } = process.env.AWS_COGNITO_TEST;
    return logIn(username, password)
    .then(() => authFetch(`${process.env.AMAZON_API_GATEWAY_URL}/${username}`))
    .then(response => expect(response.status).to.not.equal(401));
  });
});
