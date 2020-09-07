require("../lib/Cache.js");

const MetaphorJs = require("../MetaphorJs.js");

/**
 * Get cached regular expression
 * @function getRegExp
 * @param {string} expr
 * @returns {RegExp}
 */
module.exports = function getRegExp(expr) {
    var g = MetaphorJs.lib.Cache.global(),
        k = "regex_"+expr;
    return g.get(k) || g.add(k, new RegExp(expr));
};
