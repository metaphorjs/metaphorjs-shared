
/**
 * Intellegently splits string into parts using a separator, 
 * leaving untouched parts where separator is inside quotes.
 * @param {string} str
 * @param {string} separator
 * @param {bool} allowEmpty
 * @returns {array}
 */
module.exports = function(str, separator, allowEmpty) {

    var l       = str.length,
        sl      = separator.length,
        i       = 0,
        prev    = 0,
        inQDbl  = false,
        inQSng  = false,
        parts   = [],
        esc     = "\\",
        char;

    if (!sl) {
        return [str];
    }

    for (; i < l; i++) {

        char = str.charAt(i);

        if (char == esc) {
            i++;
            continue;
        }

        if (char == '"') {
            inQDbl = !inQDbl;
            continue;
        }
        if (char == "'") {
            inQSng = !inQSng;
            continue;
        }

        if (!inQDbl && !inQSng) {
            if ((sl == 1 && char == separator) ||
                (sl > 1 && str.substring(i, i + sl) == separator)) {

                if (str.substr(i - 1, sl) == separator ||
                    str.substr(i + 1, sl) == separator) {

                    if (!allowEmpty) {
                        i += (sl - 1);
                        continue;
                    }
                }

                parts.push(str.substring(prev, i).replace(esc + separator, separator));
                prev = i + sl;
                i += (sl - 1);
            }
        }
    }

    parts.push(str.substring(prev).replace(esc + separator, separator));

    return parts;
};