var $ = require('jquery');

module.exports = (function() {
  var Editor = function(controller) {
    this.controller_ = controller;
    this.initListeners_();
  };

  Editor.prototype.initListeners_ = function() {
    var runListener = this.onRun.bind(this);
    $('#run-button').click(runListener);
  };

  Editor.prototype.onRun = function(e) {
    this.controller_.checkCode(this.getCode());
  };

  Editor.prototype.getCode = function() {
    return 'var a = 1;'
  };

  return Editor;
})();
