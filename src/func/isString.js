
/**
 * Check if given value is a string
 * @function isString
 * @param {*} value 
 * @returns {boolean}
 */
module.exports = function isString(value) {
    return typeof value === "string" || value === ""+value;
};