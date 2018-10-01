/**
 * Execute <code>fn</code> asynchronously
 * @function async
 * @param {Function} fn Function to execute
 * @param {Object} context Function's context (this)
 * @param {[]} args Arguments to pass to fn
 * @param {number} timeout Execute after timeout (number of ms)
 */
module.exports = function async(fn, context, args, timeout) {
    return setTimeout(function(){
        fn.apply(context, args || []);
    }, timeout || 0);
};