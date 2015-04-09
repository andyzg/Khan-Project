var $ = require('jquery');
var ace = require('brace');
var _ = require('underscore');
require('brace/mode/javascript');
require('brace/theme/github');

module.exports = (function() {

  var Editor = function(controller) {
    this.controller_ = controller;
    this.editor_ = ace.edit('editor');
    this.editor_.getSession().setMode('ace/mode/javascript');
    this.editor_.setHighlightActiveLine(true);
    this.editor_.getSession().setUseWrapMode(true);
    this.editor_.getSession().setWrapLimitRange(0, 80);
    this.editor_.setOption("showPrintMargin", false);
    // Disables warning message.
    this.editor_.$blockScrolling = Infinity;
    this.initListeners_();
  };

  Editor.prototype.initListeners_ = function() {
    var checkCode = _.bind(this.checkCode, this);
    var isWriting = false;
    var hasChanged = false;

    this.editor_.getSession().on('change', function() {
      isWriting = true;
      hasChanged = true;
    });
    setInterval(function() {
      if (isWriting) {
        isWriting = false;
      } else if (hasChanged) {
        checkCode();
        hasChanged = false;
      }
    }, 1000);
  };

  Editor.prototype.checkCode = function() {
    var code = this.editor_.getValue();
    if (!code) {
      return;
    }
    this.controller_.checkCode(code);
  };

  return Editor;

})();
