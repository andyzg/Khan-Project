var Controller = require('./controller.js');
var $ = require('jquery');

$(function() {
  new Controller({
    'whitelist': ['ForStatement'],
    'blacklist': ['IfStatement'],
    'structure': {}
  });
});
