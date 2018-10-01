
var _getEnvType = require("./_/_getEnvType.js");

/**
 * Check if currently running in browser
 * @function isBrowser
 * @returns {boolean}
 */
module.exports = function isBrowser(){
    return _getEnvType().isWindow;
};