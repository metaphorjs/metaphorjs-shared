

/**
 * @function levenshteinMove {
 *  @param {array} a1
 *  @param {array} a2 
 *  @param {array} prescription Prescription from levenshteinDiff
 *  @param {function} getKey {
 *      Function that tracks unique items of array
 *      @param {*} item 
 *      @returns {string} item id
 *  }
 * }
 */
module.exports = function levenshteinMove(a1, a2, prs, getKey) {

    var newPrs = [],
        i, l, k, action,
        map1 = {},
        prsi,
        a2i,
        index;

    for (i = 0, l = a1.length; i < l; i++) {
        k = getKey(a1[i], i);
        if (k) {
            map1[k] = i;
        }
    }

    a2i = 0;
    var used = {};

    for (prsi = 0, l = prs.length; prsi < l; prsi++) {

        action = prs[prsi];

        if (action === 'D') {
            continue;
        }

        k = getKey(a2[a2i], a2i);

        if (k !== undefined && used[k] !== true && (index = map1[k]) !== undefined) {
            newPrs.push(index);
            used[k] = true;
        }
        else {
            newPrs.push(action);
        }
        a2i++;
    }

    return newPrs;
};