var Editor = require('./editor.js');
var parser = require('./parser.js');

module.exports = (function() {
  var Controller = function(opts) {
    this.editor_ = new Editor(this);
    this.opts_ = opts ? opts : {};
  };

  Controller.prototype.checkCode = function(code) {
    var errorMessage = parser.validateCode(code, this.opts_);
    if (errorMessage) {
      this.handleError(errorMessage);
    } else {
      alert('Success!');
    }
  };

  Controller.prototype.handleError = function(message) {
    // Handle the error in a better way.
    alert(message);
  }

  return Controller;
})();
