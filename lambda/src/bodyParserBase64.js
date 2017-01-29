const contentTypeParser = require('content-type').parse;

module.exports = () => (req, res, next) => {
  try {
    const contentType = contentTypeParser(req.headers['content-type']);
    if (contentType.type !== 'application/octet-stream') {
      next();
      return;
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
  } catch (err) {
    console.log(err);
    next();
  }
};
