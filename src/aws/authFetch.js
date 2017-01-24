let token;

export function updateToken(newToken) {
  token = newToken;
}

export function is2XX(response) {
  return response.status >= 200 && response.status < 300;
}

export default function authFetch(url, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options ? options.headers : {}),
      Authorization: token,
    },
  });
}
