var esprima = require('esprima');
var _ = require('underscore');
var statement = require('./statement.js');

/**
 * Esprima returns an object as a body if there is only one child. This wraps
 * it in an array to reuse code as well as checks if it exists.
 * @param {Object} node The target tree node.
 * @return {?Array} An array of nodes belonging to the tree node's body.
 * @private
 */
function getBody(node) {
  var body = node['body'];
  // If statements don't have bodies, they have consequences and alternates.
  if (!body && node['type'] == statement.IF) {
    // Body of an if statement.
    body = [node['consequent']];
    // Else statement if it exists.
    if (node['alternate']) {
      body.append(node['alternate']);
    }
  }
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
function hasWhitelisted(tree, whitelist) {
  if (whitelist.length === 0) {
    return true;
  }
  var body = getBody(tree);
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
    if (hasWhitelisted(node, whitelist)) {
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
function hasBlacklisted(tree, blacklist) {
  var body = getBody(tree);
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

    var errorMsg = hasBlacklisted(node, blacklist);
    if (errorMsg) {
      return errorMsg;
    }
  }

  return null;
}

/**
 * Checks if the parse tree is roughly the same structure as required.
 * @param {Object} tree The parse tree of the inputted code.
 * @param {Array.<Object>} structure The structure required for the code.
 * @param {?number=} structureIndex The index of the current structure being
 *    matched.
 * @return {bool} If true, then the code follows the required structure.
 */
function checkStructure(tree, structure, structureIndex) {
  // No structure requirement means everything passes.
  if (!structure) {
    return true;
  }
  // Optional argument, 0 by default.
  if (!structureIndex) {
    structureIndex = 0;
  }

  var body = getBody(tree);
  if (!body) {
    return _.isEmpty(structure);
  }

  // We check if the current tree node respects the conditions for the current
  // structure node. sIndex keeps the temporary index in case it fails.
  // The below checks if the child respects the type of the structure's child
  // node. If it does, it passes down the children of that node and 0 as the
  // starting index for those children nodes.
  var sIndex = structureIndex;
  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    if (body[i]['type'] === structure[sIndex]['type'] &&
        checkStructure(body[i], structure[sIndex]['children'], 0)) {
      sIndex++;
      if (sIndex >= structure.length) {
        return true;
      }
    }
  }

  // If this current node doesn't correspond to the current structure node,
  // then look for a child node that does.
  for (var i = 0; i < body.length; i++) {
    if (checkStructure(body[i], structure, structureIndex)) {
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
function validateCode(code, opt) {
  try {
    var parsedCode = esprima.parse(code, {tolerant: true, loc: true});
  } catch (e) {
    return e.description;
  }

  if (opt['whitelist']) {
    var whitelistedFuncs = opt['whitelist'].slice();
    var isValid = hasWhitelisted(parsedCode, whitelistedFuncs);
    if (whitelistedFuncs.length !== 0) {
      // TODO: Fix the grammar in the error message.
      return 'Uh oh! Your program must have ' + whitelistedFuncs.join(' and ') +
        ' for this problem!';
    }
  }

  // TODO: Check for valid syntax
  if (opt['blacklist']) {
    var errorMessage = hasBlacklisted(parsedCode, opt['blacklist']);
    if (errorMessage) {
      return errorMessage;
    }
  }

  if (opt['structure']) {
    var matchesStructure = checkStructure(parsedCode, opt['structure']);
    if (!matchesStructure) {
      return "Hmm, your program's structure doesn't match with what I had " +
      "hoped for.";
    }
  }

  return null;
};

module.exports = {
  getBody: getBody,
  hasWhitelisted: hasWhitelisted,
  hasBlacklisted: hasBlacklisted,
  checkStructure: checkStructure,
  validateCode: validateCode
}
