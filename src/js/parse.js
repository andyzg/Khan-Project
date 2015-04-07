var esprima = require('esprima');

module.exports = function(code, opt) {
  return esprima.parse(code);
};
