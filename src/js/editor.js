'use strict';

var $ = require('jquery');
var ace = require('brace');
var _ = require('underscore');
require('brace/mode/javascript');
require('brace/theme/github');

module.exports = (function() {

  /**
   * A decorator for the code editor. Uses Ace and handles the loop that checks
   * code changes.
   * @param {Controller} controller The controller of the ui. Provides an
   *    interface to check the code.
   * @constructor
   */
  var Editor = function(controller) {
    this.controller_ = controller;
    this.editor_ = ace.edit('editor');

    // Editor config.
    this.editor_.getSession().setMode('ace/mode/javascript');
    this.editor_.setHighlightActiveLine(true);
    this.editor_.getSession().setUseWrapMode(true);
    this.editor_.getSession().setWrapLimitRange(0, 80);
    this.editor_.setOption("showPrintMargin", false);
    // Disables warning message.
    this.editor_.$blockScrolling = Infinity;
    this.initListeners_(1000);
  };

  /**
   * Checks every interval if there was a change or not. If there is, don't
   * parse. Otherwise, if there's been a change in the code(i.e. last interval,
   * we didn't check), then check the code.
   * @param {number} interval The time between each interval in milliseconds.
   */
  Editor.prototype.initListeners_ = function(interval) {
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
    }, interval);
  };

  /**
   * Checks the code if it's not empty.
   */
  Editor.prototype.checkCode = function() {
    var code = this.editor_.getValue();
    if (!code) {
      return;
    }
    this.controller_.checkCode(code);
  };

  return Editor;

})();
