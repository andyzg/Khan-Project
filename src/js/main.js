var Controller = require('./controller.js');
var $ = require('jquery');
var statement = require('./statement.js');

$(function() {
  new Controller({
    whitelist: [statement.FOR],
    blacklist: [],
    structure: [{
      type: statement.FOR,
      children: [{
        type: statement.FOR,
      }, {
        type: statement.FOR,
      }, {
        type: statement.IF,
        children: [{
          type: statement.FOR
        }]
      }
      ]
    }]
  });
});
