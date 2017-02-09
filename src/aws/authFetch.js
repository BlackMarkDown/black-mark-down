import getSession from './IdentityManager/getSession';

export function is2XX(response) {
  return response.status >= 200 && response.status < 300;
}

const getToken = () =>
  getSession()
  .then(session => session.accessToken.jwtToken);

export default function authFetch(url, options) {
  const fullURL = `${process.env.AMAZON_API_GATEWAY_URL}/${url}`;
  return getToken()
  .then(token =>
    fetch(fullURL, {
      ...options,
      headers: {
        ...(options ? options.headers : {}),
        Authorization: token,
      },
    })
  );
}
