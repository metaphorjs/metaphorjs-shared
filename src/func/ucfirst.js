
/**
 * Change first character to upper case
 * @function ucfirst
 * @param {string} str 
 * @returns {string}
 */
module.exports = function ucfirst(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};