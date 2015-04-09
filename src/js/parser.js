var esprima = require('esprima');
var _ = require('underscore');

/**
 * Ensures that the inputted code has all the statements in the whitelist.
 * @param {Object} tree The parsed tree of the code being inputted.
 * @param {Array.<string>} blacklist An array of whitelisted statements.
 * @return {bool} If true, it has all of the whitelisted statements.
 * @private
 */
function hasWhitelisted_(tree, whitelist) {
  if (whitelist.length === 0) {
    return true;
  }
  var body = tree['body'];
  if (!body) {
    return false;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    // If is a whitelisted element, remove from array.
    var whitelistIndex = _.indexOf(blacklist, node['type']);
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
  var body = tree['body'];
  if (!body) {
    return null;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    // Search for blacklist
    var blacklistIndex = blacklist.indexOf(node['type']);
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
  var body = tree['body'];
  if (!body) {
    return Object.keys(structure).length === 0;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    // TODO: Check structure.
  }

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
    var structureErrorMsg = checkStructure_(parsedCode, opt['structure']);
    if (structureErrorMsg) {
      return structureErrorMsg;
    }
  }

  return null;
};
