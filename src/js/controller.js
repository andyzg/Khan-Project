'use strict';

var Editor = require('./editor.js');
var parser = require('./parser.js');
var $ = require('jquery');

module.exports = (function() {

  /**
   * The main controller of the web page. Handles the UI.
   * @param {Object.<string, Array} opts The constraints for the code.
   * @constructor
   */
  var Controller = function(opts) {
    this.editor_ = new Editor(this);
    this.opts_ = opts ? opts : {};
    $('#validation').html('<pre>' + JSON.stringify(opts, null, 2) + '</pre>');
  };

  /**
   * Checks the code for any errors. Outputs if any, otherwise, success.
   * @param {string} code The current code in the editor.
   */
  Controller.prototype.checkCode = function(code) {
    var errorMessage = parser.validateCode(code, this.opts_);
    $('#message').text(errorMessage ? errorMessage : 'Success!');
  };

  return Controller;

})();
