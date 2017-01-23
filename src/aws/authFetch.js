let token;

export function updateToken(newToken) {
  token = newToken;
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
