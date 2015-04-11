'use strict';

var Editor = require('./editor.js');
var parser = require('./parser.js');
var $ = require('jquery');

module.exports = (function() {
  var Controller = function(opts) {
    this.editor_ = new Editor(this);
    this.opts_ = opts ? opts : {};
  };

  Controller.prototype.checkCode = function(code) {
    var errorMessage = parser.validateCode(code, this.opts_);
    $('#message').text(errorMessage ? errorMessage : 'Success!');
  };

  return Controller;
})();
