const toArray = require( "./toArray");
const isPlainObject = require( "./isPlainObject");
const isBool = require( "./isBool");

/**
 * Copy properties = require( one object to another
 * @function extend
 * @param {Object} dst
 * @param {Object} src
 * @param {Object} src2 ... srcN
 * @param {boolean} override {
 *  Override already existing keys 
 *  @default false
 * }
 * @param {boolean} deep {
 *  Do not copy objects by link, deep copy by value
 *  @default false
 * }
 * @returns {object}
 */
module.exports = function extend() {

    var override    = false,
        deep        = false,
        args        = toArray(arguments),
        dst         = args.shift(),
        src,
        k,
        value;

    if (isBool(args[args.length - 1])) {
        override    = args.pop();
    }
    if (isBool(args[args.length - 1])) {
        deep        = override;
        override    = args.pop();
    }

    if (override && !deep && typeof Object !== "undefined" && !!Object.assign) {
        Object.assign.apply(Object, [dst].concat(args));
        return dst;
    }

    while (args.length) {
        
        // src can be empty
        src = args.shift();
        
        if (!src) {
            continue;
        }

        for (k in src) {

            if (src.hasOwnProperty(k) && (value = src[k]) !== undefined) {

                if (deep) {
                    if (dst[k] && isPlainObject(dst[k]) && isPlainObject(value)) {
                        extend(dst[k], value, override, deep);
                    }
                    else {
                        if (override === true || dst[k] == undefined) { // == checks for null and undefined
                            if (isPlainObject(value)) {
                                dst[k] = {};
                                extend(dst[k], value, override, true);
                            }
                            else {
                                dst[k] = value;
                            }
                        }
                    }
                }
                else {
                    if (override === true || dst[k] == undefined) {
                        dst[k] = value;
                    }
                }
            }
        }
    }

    return dst;
};
