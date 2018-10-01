

/**
 * Convert dashes to camel case
 * @function toCamelCase
 * @param {string} str 
 * @returns {string}
 */
module.exports = function toCamelCase(str) {
    return str.replace(/-./g, function(match) {
        return match.charAt(1).toUpperCase();
    });
};

