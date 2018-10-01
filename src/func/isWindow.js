
/**
 * Check if given object is a window object
 * @function isWindow
 * @param {*} obj 
 * @returns {boolean}
 */
module.exports = function isWindow(obj) {
    return obj === window ||
           (obj && obj.document && obj.location && 
            obj.alert && obj.setInterval);
};