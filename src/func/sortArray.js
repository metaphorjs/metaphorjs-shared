
const isFunction = require("./isFunction.js"),
    isPlainObject = require("./isPlainObject.js");

/**
 * Sort array of various objects by some field
 * @function sortArray
 * @param {array} arr Array to sort
 * @param {function|string|object} by {
 *  Either a string: object field name to sort by<br>
 *  Or a function: takes array item and returns value by which to sort<br>
 *  Or an object:
 *  @type {function} fn {
 *      @param {*} itemA
 *      @param {*} itemB
 *      @returns {number} -1,0,1
 *  }
 *  @type {object|null} context fn's context
 * }
 * @param {string} dir 
 * @returns {array}
 */
module.exports = function sortArray(arr, by, dir) {

    if (!dir) {
        dir = "asc";
    }

    var ret = arr.slice(),
        fn, ctx;

    if (isPlainObject(by) && by.fn) {
        fn = by.fn;
        ctx = by.context;
    }

    ret.sort(function(a, b) {

        if (fn) {
            return fn.call(ctx, a, b);
        }

        var typeA   = typeof a,
            typeB   = typeof b,
            valueA  = a,
            valueB  = b;

        if (typeA != typeB) {
            return 0;
        }

        if (typeA === "object") {
            if (isFunction(by)) {
                valueA = by(a);
                valueB = by(b);
            }
            else {
                valueA = a[by];
                valueB = b[by];
            }
        }

        if (typeof valueA === "number") {
            return valueA - valueB;
        }
        else {
            valueA = ("" + valueA).toLowerCase();
            valueB = ("" + valueB).toLowerCase();

            if (valueA === valueB) return 0;
            return valueA > valueB ? 1 : -1;
        }
    });

    return dir == "desc" ? ret.reverse() : ret;

};