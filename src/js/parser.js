var esprima = require('esprima');
var _ = require('underscore');

/**
 * Esprima returns an object as a body if there is only one child. This wraps
 * it in an array to reuse code as well as checks if it exists.
 * @param {Object} tree The target tree node.
 * @return {?Array} An array of nodes belonging to the tree node's body.
 * @private
 */
function getBody_(tree) {
  var body = tree['body'];
  if (!body) {
    return null;
  }
  return _.isArray(body) ? body : [body];
}

/**
 * Ensures that the inputted code has all the statements in the whitelist.
 * @param {Object} tree The parsed tree of the code being inputted.
 * @param {Array.<string>} whitelist An array of whitelisted statements.
 * @return {bool} If true, it has all of the whitelisted statements.
 * @private
 */
function hasWhitelisted_(tree, whitelist) {
  if (whitelist.length === 0) {
    return true;
  }
  var body = getBody_(tree);
  if (!body) {
    return false;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    // If is a whitelisted element, remove from array.
    var whitelistIndex = _.indexOf(whitelist, node['type']);
    if (whitelistIndex !== -1) {
      whitelist.splice(whitelistIndex, 1);
    }
    if (hasWhitelisted_(node, whitelist)) {
      return true;
    }
  }
  return false;
}

/**
 * Validates the code for the blacklist check.
 * @param {Object} tree The parsed tree of the code being inputted.
 * @param {Array.<string>} blacklist An array of blacklisted statements.
 * @return {?string} An optional error message.
 * @private
 */
function hasBlacklisted_(tree, blacklist) {
  var body = getBody_(tree);
  if (!body) {
    return null;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    // Search for blacklist
    var blacklistIndex = _.indexOf(blacklist, node['type']);
    if (blacklistIndex !== -1) {
      // TODO: Point to line number.
      return 'Sorry! Your code cannot have any ' + node['type'] + ' in it :(';
    }

    var errorMsg = hasBlacklisted_(node, blacklist);
    if (errorMsg) {
      return errorMsg;
    }
  }

  return null;
}

/**
 * Checks if the parse tree is roughly the same structure as required.
 * @param {Object} tree The parse tree of the inputted code.
 * @param {Object} structure The structure required for the code.
 * @return {bool} If true, then the code follows the required structure.
 */
function checkStructure_(tree, structure) {
  var body = getBody_(tree);
  if (!body) {
    return _.isEmpty(structure);
  }

  // If the current node matches the current structure node, then we iterate
  // through the structure node's children.
  if (tree['type'] === structure['type']) {
    var currentIndex = 0;
    var structureChildren = structure['children'];
    for (var i = 0; i < body.length; i++) {
      if (!structureChildren ||
          currentIndex >= structureChildren.length) {
        return true;
      }
      if (checkStructure_(body[i], structureChildren[currentIndex])) {
        currentIndex++;
      }
    }
    if (currentIndex >= structureChildren.length) {
      return true;
    }
  }

  // If there's no success with the above, then we continue going down the tree
  // to search for a subtree matching its structure.
  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    if (checkStructure_(body[i], structure)) {
      return true;
    }
  }

  return false;
}

/**
 * Parses the code, and then determines if the code is valid. There are three
 * validations with the parsed output.
 * - A whitelist, where it makes sure the code uses whitelisted statements.
 * - A blacklist, where it makes sure the code doesn't use certain statements.
 * - A structure check that makes sure the code follows a certain structure.
 * @param {string} code The code being checked.
 * @param {Object.<string,Array|Object>} opt An object containing the options. Field
 *    options are whitelist, blacklist, and structure
 * @return {?string} An optional error message.
 */
exports.validateCode = function(code, opt) {
  var parsedCode = esprima.parse(code);

  if (opt['whitelist']) {
    var whitelistedFuncs = opt['whitelist'].slice();
    var isValid = hasWhitelisted_(parsedCode, whitelistedFuncs);
    if (whitelistedFuncs.length !== 0) {
      // TODO: Fix the grammar in the error message.
      return 'Uh oh! Your program must have ' + whitelistedFuncs.join(' and ') +
        ' for this problem!';
    }
  }

  // TODO: Check for valid syntax
  if (opt['blacklist']) {
    var errorMessage = hasBlacklisted_(parsedCode, opt['blacklist']);
    if (errorMessage) {
      return errorMessage;
    }
  }

  if (opt['structure']) {
    var matchesStructure = checkStructure_(parsedCode, opt['structure']);
    if (!matchesStructure) {
      return "Hmm, your program's structure doesn't match with what I had " +
      "hoped for.";
    }
  }

  return null;
};
