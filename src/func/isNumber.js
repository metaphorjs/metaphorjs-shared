
var _varType = require("./_/_varType.js");

/**
 * Check if given value is a number (not number-like)
 * @function isNumber
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isNumber(value) {
    return _varType(value) === 1;
};