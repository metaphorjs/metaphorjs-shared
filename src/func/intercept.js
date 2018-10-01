/**
 * Function interceptor
 * @function intercept
 * @param {function} origFn Original function
 * @param {function} interceptor Function that should execute instead(ish)
 * @param {object|null} context Function's context
 * @param {object|null} origContext Original function's context
 * @param {string} when {
 *  before | after | instead
 *  @default before
 * }
 * @param {bool} replaceValue true to return interceptor's return value
 * instead of original
 * @returns {Function}
 */
module.exports = function intercept(origFn, interceptor, context, origContext, when, replaceValue) {

    when = when || "before";

    return function() {

        var intrRes,
            origRes;

        if (when == "instead") {
            return interceptor.apply(context || origContext, arguments);
        }
        else if (when == "before") {
            intrRes = interceptor.apply(context || origContext, arguments);
            origRes = intrRes !== false ? origFn.apply(origContext || context, arguments) : null;
        }
        else {
            origRes = origFn.apply(origContext || context, arguments);
            intrRes = interceptor.apply(context || origContext, arguments);
        }

        return replaceValue ? intrRes : origRes;
    };
};