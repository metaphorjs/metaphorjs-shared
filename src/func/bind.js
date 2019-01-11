
/**
 * Bind function to context (Function.bind wrapper)
 * @function bind
 * @param {function} fn
 * @param {*} context
 * @returns {function}
 */
module.exports = function bind(fn, context){
    return fn.bind(context);
};