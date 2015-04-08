var Editor = require('./editor.js');
var parser = require('./parser.js');

module.exports = (function() {
  var Controller = function(opts) {
    this.editor_ = new Editor(this);
    this.opts_ = opts ? opts : {};
  };

  Controller.prototype.checkCode = function(code) {
    var errorMessage = parser.parse(code, this.opts_);
    if (errorMessage) {
      this.handleError(errorMessage);
    } else {
      console.log('Success!');
    }
  };

  Controller.prototype.handleError = function(message) {
    console.error(message);
  }

  return Controller;
})();
