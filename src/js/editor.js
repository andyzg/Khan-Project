var $ = require('jquery');

module.exports = (function() {

  var Editor = function(controller) {
    this.controller_ = controller;
    this.initListeners_();
  };

  Editor.prototype.initListeners_ = function() {
    var clickListener = _.bind(this.onClick, this);
    $('#run-button').click(clickListener);
  };

  Editor.prototype.onClick = function(e) {
    var code = $('#code').val();
    this.controller_.checkCode(code);
  };

  return Editor;

})();
