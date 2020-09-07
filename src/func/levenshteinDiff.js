
const equals = require("./equals.js");

/**
 * @function levenshteinDiff {
 *  @param {array} from
 *  @param {array} to
 *  @returns {object} {
 *      @type {number} changes
 *      @type {int} distance
 *      @type {array} prescription {
 *          List of instructions D(delete),R(replace),I(insert)
 *      }
 *  }
 * }
 */
module.exports = function levenshteinDiff(from, to) {

    var m = from.length,
        n = to.length,
        D = new Array(m + 1),
        P = new Array(m + 1),
        i, j, c,
        route,
        cost,
        dist,
        ops = 0;

    if (m == n && m === 0) {
        return {
            changes: 0,
            distance: 0,
            prescription: []
        };
    }

    for (i = 0; i <= m; i++) {
        D[i]    = new Array(n + 1);
        P[i]    = new Array(n + 1);
        D[i][0] = i;
        P[i][0] = 'D';
    }
    for (i = 0; i <= n; i++) {
        D[0][i] = i;
        P[0][i] = 'I';
    }

    for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
            cost = (!equals(from[i - 1], to[j - 1])) ? 1 : 0;

            if(D[i][j - 1] < D[i - 1][j] && D[i][j - 1] < D[i - 1][j - 1] + cost) {
                //Insert
                D[i][j] = D[i][j - 1] + 1;
                P[i][j] = 'I';
            }
            else if(D[i - 1][j] < D[i - 1][j - 1] + cost) {
                //Delete
                D[i][j] = D[i - 1][j] + 1;
                P[i][j] = 'D';
            }
            else {
                //Replace or noop
                D[i][j] = D[i - 1][j - 1] + cost;
                if (cost === 1) {
                    P[i][j] = 'R';
                }
                else {
                    P[i][j] = '-';
                }
            }
        }
    }

    //Prescription
    route = [];
    i = m;
    j = n;

    do {
        c = P[i][j];
        route.push(c);
        if (c !== '-') {
            ops++;
        }
        if(c === 'R' || c === '-') {
            i --;
            j --;
        }
        else if(c === 'D') {
            i --;
        }
        else {
            j --;
        }
    } while((i !== 0) || (j !== 0));

    dist = D[m][n];

    return {
        changes: ops / route.length,
        distance: dist,
        prescription: route.reverse()
    };
};
