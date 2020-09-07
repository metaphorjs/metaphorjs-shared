
const _varType = require( "./_/_varType");

/**
 * Check if given value is plain object
 * @function isPlainObject
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isPlainObject(value) {
    // IE < 9 returns [object Object] = require( toString(htmlElement)
    return typeof value == "object" &&
           _varType(value) === 3 &&
            !value.nodeType &&
            value.constructor === Object;
};