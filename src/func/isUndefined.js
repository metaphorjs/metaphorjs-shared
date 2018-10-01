
var strUndef = require("../var/strUndef.js");

/**
 * Check if given variable is undefined
 * @function isUndefined
 * @param {*} any 
 * @returns {boolean}
 */
module.exports = function isUndefined(any) {
    return typeof any === strUndef;
};
