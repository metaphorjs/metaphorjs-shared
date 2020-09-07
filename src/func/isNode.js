
const _getEnvType = require("./_/_getEnvType.js");


/**
 * Check if currently running in node env
 * @function isNode
 * @returns {boolean}
 */
module.exports = function isNode(){
    return _getEnvType().isNode;
};