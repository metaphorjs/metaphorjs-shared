
var _varType = require("./_/_varType.js");

/**
 * Check if given value is an object (non-scalar)
 * @function isObject
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isObject(value) {
    if (value === null || typeof value != "object") {
        return false;
    }
    var vt = _varType(value);
    return vt > 2 || vt == -1;
};