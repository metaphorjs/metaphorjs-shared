
var _varType = require("./_/_varType.js");

/**
 * Check if given value is a Date object
 * @function isDate
 * @param {*} value
 * @returns {boolean} 
 */
module.exports = function isDate(value) {
    return _varType(value) === 10;
};