var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var env = require('../.env.js');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
}, env);
