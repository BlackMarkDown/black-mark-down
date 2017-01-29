let token;

export function updateToken(newToken) {
  token = newToken;
}

export function is2XX(response) {
  return response.status >= 200 && response.status < 300;
}

export default function authFetch(url, options) {
  const fullURL = `${process.env.AMAZON_API_GATEWAY_URL}/${url}`;
  return fetch(fullURL, {
    ...options,
    headers: {
      ...(options ? options.headers : {}),
      Authorization: token,
    },
  });
}
