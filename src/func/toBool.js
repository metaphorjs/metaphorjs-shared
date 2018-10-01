
/**
 * Converts given value to boolean. <br>
 * false: "", 0, false, undefined, null, "false", "no", "0"<br>
 * true: everything else
 * @function toBool
 * @param {*} val 
 * @returns {boolean}
 */
module.exports = function toBool(val) {
    if (!val) { // real false, empty string, null, zero
        return false;
    }
    if (typeof val === "string") {
        val = val.toLowerCase();
        if (val === "false" || val === "no" || val === '0') {
            return false;
        }
    }
    return true;
};