const TOKEN_LOCAL_STORAGE_KEY = 'authToken';

let token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);

export function updateToken(newToken) {
  localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, newToken);
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
