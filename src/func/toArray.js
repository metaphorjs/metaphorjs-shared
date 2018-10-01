
var undf = require("../var/undf.js");

/**
 * Transform anything into array
 * @function toArray
 * @param {*} list
 * @returns {array}
 */
module.exports = function toArray(list) {
    if (list && !list.length != undf && list !== ""+list) {
        for(var a = [], i =- 1, l = list.length>>>0; ++i !== l; a[i] = list[i]){}
        return a;
    }
    else if (list) {
        return [list];
    }
    else {
        return [];
    }
};