
var lib_Cache = require("../lib/Cache.js");

/**
 * Get cached regular expression
 * @function getRegExp
 * @param {string} expr
 * @returns {RegExp}
 */
module.exports = function getRegExp(expr) {
    var g = lib_Cache.global(),
        k = "regex_"+expr;
    return g.get(k) || g.add(k, new RegExp(expr));
};
