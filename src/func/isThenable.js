
const isFunction = require("./isFunction.js");

/**
 * Checks if given value is a thenable (a Promise)
 * @function isThenable
 * @param {*} any
 * @returns {boolean|function}
 */
module.exports = function isThenable(any) {

    // any.then must only be accessed once
    // this is a promise/a+ requirement

    if (!any) { //  || !any.then
        return false;
    }
    
    var t;

    //if (!any || (!isObject(any) && !isFunction(any))) {
    if (((t = typeof any) != "object" && t != "function")) {
        return false;
    }

    var then = any.then;

    return isFunction(then) ? then : false;
};