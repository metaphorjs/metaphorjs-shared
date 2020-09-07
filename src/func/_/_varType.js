
const toString = require("../toString");

module.exports = (function() {

    const types = {
        '[object String]': 0,
        '[object Number]': 1,
        '[object Boolean]': 2,
        '[object Object]': 3,
        '[object Function]': 4,
        '[object Array]': 5,
        '[object RegExp]': 9,
        '[object Date]': 10
    };


    /*
     * 'string': 0,
     * 'number': 1,
     * 'boolean': 2,
     * 'object': 3,
     * 'function': 4,
     * 'array': 5,
     * 'null': 6,
     * 'undefined': 7,
     * 'NaN': 8,
     * 'regexp': 9,
     * 'date': 10,
     * unknown: -1
     * @param {*} value
     * @returns {number}
     */



    return function _varType(val) {

        if (!val) {
            if (val === null) {
                return 6;
            }
            if (val === undefined) {
                return 7;
            }
        }

        let num = types[toString.call(val)];

        if (num === undefined) {
            return -1;
        }

        if (num === 1 && isNaN(val)) {
            return 8;
        }

        return num;
    };

})();