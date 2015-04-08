var esprima = require('esprima');

/**
 * Validates the code for the whitelist check and the blacklist check.
 * It also modifies the reference to the whitelist array to be checked
 * by what called this function.
 * @param {string} tree The parsed tree of the code being inputted.
 * @param {Array.<string>} whitelist An array of whitelisted statements.
 * @param {Array.<string>} blacklist An array of blacklisted statements.
 * @return {?string} An error message for the blacklist.
 * @private
 */
function isValidContent_(tree, whitelist, blacklist) {
  var body = tree['body'];
  if (!body) {
    return null;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];

    // Search for whitelist
    var whitelistIndex = whitelist.indexOf(node['type']) ;
    if (whitelistIndex !== -1) {
      whitelist.splice(whitelistIndex, 1);
    }

    // Search for blacklist
    var blacklistIndex = blacklist.indexOf(node['type']);
    if (blacklistIndex !== -1) {
      // TODO: Point to line number.
      return 'Sorry! Your code cannot have any ' + node['type'] + ' in it :(';
    }

    var errorMsg = isValidContent_(node, whitelist, blacklist);
    if (errorMsg) {
      return errorMsg;
    }
  }

  return null;
}

function checkStructure_(tree, structure) {
  console.log(tree, 'structure!');
  return null;
}

/**
 * Parses the code, and then determines if the code is valid. There are three
 * validations with the parsed output.
 * A whitelist, where it makes sure that certain statements are used.
 * A blacklist, where it makes sure you don't use certain statements.
 * A structure check, where it makes sure you're following a certain structure.
 * @param {string} code The code being checked.
 * @param {Object.<string,Array>} opt An object containing the options. Field
 *    options are whitelist, blacklist, and structure
 */
exports.validateCode = function(code, opt) {
  var parsedCode = esprima.parse(code);

  // TODO: Check for valid syntax
  if (opt['whitelist'] || opt['blacklist']) {
    var whitelistedFuncs = opt['whitelist'] ? opt['whitelist'].slice() : [];
    var blacklistedFuncs = opt['blacklist'] ? opt['blacklist'].slice() : [];
    // TODO: I don't like how this function is doing 2 things at once for
    // blacklist and whitelist. Decouple it.
    var errorMessage = isValidContent_(parsedCode,
                                        whitelistedFuncs, blacklistedFuncs);
    if (errorMessage) {
      return errorMessage;
    }
    if (whitelistedFuncs.length !== 0) {
      // TODO: Fix the grammar in the error message.
      return 'Uh oh! Your program must have ' + whitelistedFuncs.join(' and ') +
        ' for this problem!';
    }
  }

  if (opt['structure']) {
    var requiredStructures = opt['structure'] ?
      opt['structure'].slice : [];
    var structureErrorMsg = checkStructure_(parsedCode, opt['structure']);
    if (structureErrorMsg) {
      return structureErrorMsg;
    }
  }

  return null;
};
