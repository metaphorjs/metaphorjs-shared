
var isArray = require("../func/isArray.js");

/**
 * Check if value is empty:
 * empty string, null, undefined, false, empty array
 * @function isEmpty
 * @param {*} val 
 * @returns {boolean}
 */
module.exports = function isEmpty(val) {

    if (!val) {
        return true;
    }

    if (isArray(val) && val.length === 0) {
        return true;
    }

    return false;
};
