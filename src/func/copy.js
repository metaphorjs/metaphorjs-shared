
const isArray = require("./isArray.js"),
    isRegExp = require("./isRegExp.js"),
    isPlainObject = require("./isPlainObject.js"),
    isDate = require("./isDate.js"),
    isFunction = require("./isFunction.js");

module.exports = function copy(source, dest){

    if (typeof window != "undefined" && source === window) {
        throw new Error("Cannot copy window object");
    }
    else if (typeof global != "undefined" && source === global) {
        throw new Error("Cannot copy global object");
    }

    if (!dest) {
        dest = source;
        if (source) {
            if (isArray(source)) {
                dest = copy(source, []);
            } else if (isDate(source)) {
                dest = new Date(source.getTime());
            } else if (isRegExp(source)) {
                dest = new RegExp(source.source);
            } else if (isPlainObject(source)) {
                dest = copy(source, {});
            }
        }
    } else {
        if (source === dest) {
            throw new Error("Objects are identical");
        }
        if (isArray(source)) {
            dest.length = 0;
            for ( var i = 0, l = source.length; i < l; i++) {
                dest.push(copy(source[i]));
            }
        } else {
            var key;
            for (key in dest) {
                delete dest[key];
            }
            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    if (key.charAt(0) == '$' || isFunction(source[key])) {
                        dest[key] = source[key];
                    }
                    else {
                        dest[key] = copy(source[key]);
                    }
                }
            }
        }
    }
    return dest;
};
