var parser = require('../src/js/parser');
var statement = require('../src/js/statement');
var assert = require('assert');
var esprima = require('esprima');

// TODO: Clean up the tests, it's hard to read.
describe('parser', function() {
  describe('#getBody()', function() {
    it('should return the body in an array if it exists', function() {
      assert.equal(parser.getBody({}), null);
      // Basic tests.
      assert.deepEqual(parser.getBody({body: 'body'}), ['body']);
      assert.deepEqual(parser.getBody({body: []}), []);
      assert.deepEqual(parser.getBody({body: ['body']}), ['body']);
      assert.deepEqual(parser.getBody({body: ['foo', 'bar']}), ['foo', 'bar']);

      // If statements
      assert.deepEqual(parser.getBody({
        type: statement.IF,
        consequent: 'foo'
      }), ['foo']);
      assert.deepEqual(parser.getBody({
        type: statement.IF,
        consequent: 'foo',
        alternate: 'bar'
      }), ['foo', 'bar']);
      assert.deepEqual(parser.getBody({
        consequent: 'foo',
        alternate: 'bar'
      }), null);
    });
  });

  describe('#hasWhitelisted()', function() {
    it('should return a boolean checking if it respects the whitelist ' +
       'conditions', function() {
      var basic = esprima.parse('var i = 0;');
      assert.equal(parser.hasWhitelisted(basic, [statement.FOR]), false);

      var forLoop = esprima.parse('for (;false;) {}');
      assert.equal(parser.hasWhitelisted(forLoop, [statement.FOR]), true);

      var twoSiblingStatement = esprima.parse('if (true) {}' +
                                              'for (;false;) {}');
      assert.equal(parser.hasWhitelisted(twoSiblingStatement,
                                         [statement.FOR, statement.IF]), true);

      var twoNestedStatement = esprima.parse('if (true) {' +
                                        'for (;false;) {' +
                                        'console.log(true);' +
                                        '}' +
                                        '}');
      assert.equal(parser.hasWhitelisted(twoNestedStatement,
                                         [statement.FOR, statement.IF]), true);

      var cantFind = esprima.parse('for (;1;) {} if (1) {}');
      assert.equal(parser.hasWhitelisted(cantFind, [statement.WHILE]), false);

      var cantFindNested = esprima.parse('for (;1;) { if (1) {} }');
      assert.equal(parser.hasWhitelisted(cantFindNested, [statement.WHILE]), false);
    });
  });

  describe('#hasBlacklisted()', function() {
    it('should return an error message if the blacklisted statement exists, ' +
       'null otherwise',
      function() {
        var none = esprima.parse('var i = 0;');
        assert.equal(parser.hasBlacklisted(basic, []), null);

        var basic = esprima.parse('var i = 0;');
        assert.equal(parser.hasBlacklisted(basic, [statement.FOR]), null);

        var forLoop = esprima.parse('for (;false;) {}');
        assert.notEqual(parser.hasBlacklisted(forLoop, [statement.FOR]), null);

        var twoSiblingStatement = esprima.parse('if (true) {}' +
                                                'for (;false;) {}');
        assert.notEqual(parser.hasBlacklisted(twoSiblingStatement,
                                              [statement.FOR, statement.IF]),
                                              null);

        var twoNestedStatement = esprima.parse('if (true) {' +
                                          'for (;false;) {' +
                                          'console.log(true);' +
                                          '}' +
                                          '}');
        assert.notEqual(parser.hasBlacklisted(twoNestedStatement,
                                           [statement.FOR]), null);

        var cantFind = esprima.parse('for (;1;) {} if (1) {}');
        assert.equal(parser.hasBlacklisted(cantFind, [statement.WHILE]), null);

        var cantFindNested = esprima.parse('for (;1;) { if (1) {} }');
        assert.equal(parser.hasBlacklisted(cantFindNested,
                                           [statement.WHILE]), null);
      }
    );
  });

  describe('#checkStructure()', function() {
    it('should return true if the code respects the structure given',
      function() {
        var basic = esprima.parse('var i = 0');
        assert.equal(parser.checkStructure(basic, []), true);

        var noIfStatement = esprima.parse('var i = 0');
        assert.equal(parser.checkStructure(noIfStatement, [{
          type: statement.IF
        }]), false);

        var ifStatement = esprima.parse('if (1) {}');
        assert.equal(parser.checkStructure(ifStatement, [{
          type: statement.IF
        }]), true);

        var nested = esprima.parse('if (1) {' +
                                   'for (;1;) {}' +
                                   '}');
        assert.equal(parser.checkStructure(nested, [{
          type: statement.IF,
          children: [{
            type: statement.FOR
          }]
        }]), true);

        var siblings = esprima.parse('if (1) {}' +
                                     'for (;1;) {}');
        assert.equal(parser.checkStructure(siblings, [{
          type: statement.IF
        }, {
          type: statement.FOR
        }]), true);

        var reverseSiblings = esprima.parse('if (1) {}' +
                                     'for (;1;) {}');
        assert.equal(parser.checkStructure(reverseSiblings, [{
          type: statement.FOR
        }, {
          type: statement.IF
        }]), false);
      }
    );
  });
});

