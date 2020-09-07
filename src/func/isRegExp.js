
const _varType = require("./_/_varType.js");

/**
 * Check if given value is regular expression
 * @function isRegExp
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isRegExp(value) {
    return _varType(value) === 9;
};