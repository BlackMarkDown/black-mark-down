const contentTypeParser = require('content-type').parse;

module.exports = () => (req, res, next) => {
  const contentTypeHeader = req.headers['content-type'];
  if (!contentTypeHeader) {
    return next();
  }
  const contentType = contentTypeParser(contentTypeHeader);
  if (contentType.type !== 'application/octet-stream') {
    return next();
  }
  const data = [];
  req.on('data', (chunk) => {
    data.push(chunk);
  });
  req.on('end', () => {
    /* eslint no-param-reassign: "off" */
    req.body = new Buffer(data.toString(), 'base64');
    next();
  });
};
