
var isBool = require("./isBool.js"),
    isFunction = require("./isFunction.js"),
    undf = require("../var/undf.js"),
    isPrimitive = require("./isPrimitive.js"),
    isPlainObject = require("./isPlainObject.js");


/**
 * Filter array of various objects by object field
 * @function filterArray
 * @param {array} list Array to filter
 * @param {string|boolean|regexp} by {
 *  Let x = array[i]<br>
 *  If x is bool and by is bool, return x === by;<br>
 *  If by is regex, return by.test(x)<br>
 *  If opt is true or not set, return x.contains(by)<br>
 *  If opt is false, return !x.contains(by)<br>
 *  If opt == "strict", return str(x) === str(by)<br><br>
 * 
 *  If x is an object, comparison goes for every property.
 *  If at least one property matches, x matches.
 * }
 * @param {string|boolean|null} opt true | false | "strict"
 */

/**
 * Filter array of various objects by object field
 * @function filterArray
 * @param {array} list Array to filter
 * @param {function} by {
 *  @param {*} value array[i]
 *  @returns {boolean}
 * }
 * @param {object} opt true | false | "strict"
 */

/**
 * Filter array of various objects by object field
 * @function filterArray
 * @param {array} list Array to filter
 * @param {object} by {
 *  Let x = array[i] and x is object.<br>
 *  Every key of "by" will be compared to the same key of "x". 
 *  Comparison goes as described in the first version of filterArray.<br>
 *  If key == "$", every key of x will be compared to by.$
 * }
 * @param {object} opt true | false | "strict"
 */
module.exports = function(){


    var compareValues = function(value, to, opt) {

            if (isFunction(to)) {
                return to(value, opt);
            }
            else if (to === "" || to === undf) {
                return true;
            }
            else if (value === undf) {
                return false;
            }
            else if (isBool(value)) {
                return value === to;
            }
            else if (to instanceof RegExp) {
                return to.test("" + value);
            }
            else if (opt === "strict") {
                return ""+value === ""+to;
            }
            else if (opt === true || opt === null || opt === undf) {
                return (""+value).toLowerCase().indexOf((""+to).toLowerCase()) != -1;
            }
            else if (opt === false) {
                return (""+value).toLowerCase().indexOf((""+to).toLowerCase()) == -1;
            }
            return false;
        },

        compare = function(value, by, opt) {

            if (isFunction(by)) {
                return by(value, opt);
            }

            if (isPrimitive(value)) {
                if (by.$ === undf) {
                    return true;
                }
                else {
                    return compareValues(value, by.$, opt);
                }
            }

            var k, i;
            for (k in by) {
                if (k === '$') {
                    for (i in value) {
                        if (compareValues(value[i], by.$, opt)) {
                            return true;
                        }
                    }
                }
                else {
                    if (compareValues(value[k], by[k], opt)) {
                        return true;
                    }
                }
            }

            return false;
        };

    var filterArray = function filterArray(a, by, opt) {

        if (!isPlainObject(by) && !isFunction(by)) {
            by = {$: by};
        }

        var ret = [],
            i, l;

        for (i = -1, l = a.length; ++i < l;) {
            if (compare(a[i], by, opt)) {
                ret.push(a[i]);
            }
        }

        return ret;
    };

    filterArray.compare = compare;

    return filterArray;

}();