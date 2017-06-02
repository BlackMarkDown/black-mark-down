export function is2XX(response) {
  return response.status >= 200 && response.status < 300;
}

export default function s3Fetch(path, options) {
  const fullURL = `http://${process.env.AMAZON_S3_BUCKET_NAME}.s3-${process.env.AWS_REGION}.amazonaws.com/${path}`;
  return fetch(fullURL, {
    ...options,
    headers: {
      ...(options ? options.headers : {}),
    },
  });
}
