
/**
 * Bind function to context (Function.bind wrapper)
 * @function bind
 * @param {Function} fn
 * @param {*} context
 */
module.exports = function bind(fn, context){
    return fn.bind(context);
};