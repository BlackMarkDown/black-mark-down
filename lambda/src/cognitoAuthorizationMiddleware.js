const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const getPem = require('rsa-pem-from-mod-exp');

const authenticatedPayloads = {};

function isExpired(payload) {
  return payload.exp < new Date().getTime() / 1000;
}

module.exports = () => (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log('no token');
    return next();
  }
  if (authenticatedPayloads[token]) {
    const payload = authenticatedPayloads[token];
    if (isExpired(payload)) {
      console.log('expired');
      return next();
    }
    console.log('cached', payload);
    req.username = payload['cognito:username'];
    return next();
  }

  return fetch(`https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`)
  .then(response => response.json())
  .then((json) => {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      console.log('unable to decode token');
      return next();
    }
    if (isExpired(decoded)) {
      console.log('expired');
      return next();
    }
    const iss = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`;
    if (decoded.payload.iss !== iss) {
      console.log(JSON.stringify(decoded));
      console.log(process.env.AWS_COGNITO_USER_POOL_ID);
      console.log('wrong iss');
      return next();
    }
    const jwtKey = json.keys.find(key => key.kid === decoded.header.kid);
    if (!jwtKey) {
      console.log('no jwt key');
      return next();
    }
    const pem = getPem(jwtKey.n, jwtKey.e);
    const decodedOnVerifying = jwt.verify(token, pem, {
      algorithms: [
        jwtKey.alg,
      ],
    });
    if (JSON.stringify(decoded.payload) !== JSON.stringify(decodedOnVerifying)) {
      console.log(JSON.stringify(decoded));
      console.log(JSON.stringify(decodedOnVerifying));
      console.log('fail to verify');
      return next();
    }
    authenticatedPayloads[token] = decoded.payload;

    console.log('verified', decoded.payload['cognito:username']);
    /* eslint no-param-reassign: "off" */
    req.username = decoded.payload['cognito:username'];
    console.log(req.username);
    return next();
  })
  .catch((err) => {
    console.log(err, err.stack);
    next();
  });
};
