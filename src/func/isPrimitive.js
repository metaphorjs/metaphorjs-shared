
var _varType = require("./_/_varType.js");

/**
 * Check if given value is a primitive (string, number, boolean)
 * @function isPrimitive
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isPrimitive(value) {
    var vt = _varType(value);
    return vt < 3 && vt > -1;
};