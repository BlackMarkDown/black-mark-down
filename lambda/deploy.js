var zipFolder = require('zip-folder');
var path = require('path');

var src = __dirname + '/.';
var dest = path.join(__dirname, './archive.zip');
console.log(src);
zipFolder(src, dest, function (err) {
  if (err) {
    console.log('Error on zipping', err);
    return;
  }
  var fs = require('fs');

  var zip = fs.readFileSync(dest);

  var params = {
    FunctionName: 'test',
    Publish: true,
    ZipFile: zip,
  };

  var AWS = require('aws-sdk');
  var lambda = new AWS.Lambda({
    region: 'ap-northeast-2',

  });
  lambda.updateFunctionCode(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
});
