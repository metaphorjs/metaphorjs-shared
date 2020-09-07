
const isBool = require("./isBool.js"),
    isFunction = require("./isFunction.js"),
    isPrimitive = require("./isPrimitive.js"),
    isPlainObject = require("./isPlainObject.js");


/**
 * Filter array of various objects by object field
 * @function filterArray
 * @param {array} list Array to filter
 * @param {string|boolean|regexp} by 
 * @param {string|boolean|null} opt true | false | "strict"
 * @code src-docs/examples/filterArray.js
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
 * @param {object} by 
 * @param {object} opt true | false | "strict"
 */
module.exports = function(){


    var compareValues = function(value, to, opt) {

            if (isFunction(to)) {
                return to(value, opt);
            }
            else if (to === "" || to === undefined) {
                return true;
            }
            else if (value === undefined) {
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
            else if (opt === true || opt === null || opt === undefined) {
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
                if (by.$ === undefined) {
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