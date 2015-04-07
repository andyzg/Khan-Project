var Editor = require('./editor.js');
var parse = require('./parse.js');

module.exports = (function() {
  var Controller = function(opts) {
    this.editor_ = new Editor(this);
  };

  Controller.prototype.checkCode = function(code) {
    console.log(parse(code));
  };

  return Controller;
})();
