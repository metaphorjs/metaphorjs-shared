
var isArray = require("./isArray.js"),
    isDate = require("./isDate.js"),
    isRegExp = require("./isRegExp.js"),
    isWindow = require("./isWindow.js"),
    isFunction = require("./isFunction.js"),
    undf = require("../var/undf.js");

// from Angular

/**
 * Performs various checks comparing two arguments. 
 * Compared items can be of any type including
 * objects and arrays.
 * @function equals
 * @param {*} o1 
 * @param {*} o2 
 * @returns {boolean}
 */
module.exports = function equals(o1, o2) {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
    if (t1 === t2) {
        if (t1 === 'object') {
            if (isArray(o1)) {
                if (!isArray(o2)) return false;
                if ((length = o1.length) === o2.length) {
                    for(key=0; key<length; key++) {
                        if (!equals(o1[key], o2[key])) return false;
                    }
                    return true;
                }
            } else if (isDate(o1)) {
                return isDate(o2) && o1.getTime() === o2.getTime();
            } else if (isRegExp(o1) && isRegExp(o2)) {
                return o1.toString() === o2.toString();
            } else {
                if (isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
                keySet = {};
                for(key in o1) {
                    if (key.charAt(0) === '$' || isFunction(o1[key])) {//&& typeof o1[key] == "object") {
                        continue;
                    }
                    //if (isFunction(o1[key])) {
                    //    continue;
                    //}
                    if (!equals(o1[key], o2[key])) {
                        return false;
                    }
                    keySet[key] = true;
                }
                for(key in o2) {
                    if (!keySet.hasOwnProperty(key) &&
                        key.charAt(0) !== '$' &&
                        o2[key] !== undf &&
                        !isFunction(o2[key])) return false;
                }
                return true;
            }
        }
    }
    return false;
};
