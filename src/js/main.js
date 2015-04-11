var Controller = require('./controller.js');
var $ = require('jquery');
var statement = require('./statement.js');

$(function() {
  new Controller({
    whitelist: [],
    blacklist: [],
    structure: []
  });
});
