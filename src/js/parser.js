var esprima = require('esprima');

function validWhitelist_(tree, funcs) {
  if (funcs.length === 0) {
    return true;
  }
  var body = tree['body'];
  if (!body) {
    return false;
  }

  for (var i = 0; i < body.length; i++) {
    var node = body[i];
    var index = funcs.indexOf(node['type']) ;
    if (index !== -1) {
      funcs.splice(index, 1);
    }

    if (validWhitelist_(node, funcs)) {
      return true;
    }
  }

  return false;
}

function checkBlacklist_(tree, funcs) {
  console.log(tree, 'blacklist!');
  return null
}

function checkStructure_(tree, structure) {
  console.log(tree, 'structure!');
  return null;
}

exports.parse = function(code, opt) {
  var parsedCode = esprima.parse(code);

  // TODO: Check for valid syntax
  if (opt['whitelist']) {
    var whitelistedFuncs = opt['whitelist'].slice();
    var isValid = validWhitelist_(parsedCode, whitelistedFuncs);
    if (!isValid) {
      return 'Missing a functionality.';
    }
  }

  if (opt['blacklist']) {
    var blacklistedFuncs = opt['blacklist'].slice();
    var blacklistErrorMsg = checkBlacklist_(parsedCode, blacklistedFuncs);
    if (blacklistErrorMsg) {
      return blacklistErrorMsg;
    }
  }

  if (opt['has_structure']) {
    var structureErrorMsg = checkStructure_(parsedCode, opt['hash_structure']);
    if (structureErrorMsg) {
      return structureErrorMsg;
    }
  }
  return null;
};
