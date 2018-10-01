
var _varType = require("./_/_varType.js");

/**
 * Check if given value is array (not just array-like)
 * @function isArray
 * @param {*} value
 * @returns {boolean}
 */
module.exports = function isArray(value) {
    return typeof value === "object" && _varType(value) === 5;
};