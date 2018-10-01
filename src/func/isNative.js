// https://gist.github.com/jdalton/5e34d890105aca44399f


/**
 * Check if given function or object is a native function
 * @function isNative
 * @param {*} value
 * @returns {boolean}
 */
module.exports = (function() {

    var toString, fnToString, reHostCtor, reNative;

    var prepare = function() {
        // Used to resolve the internal `[[Class]]` of values.
        toString = Object.prototype.toString;

        // Used to resolve the decompiled source of functions.
        fnToString = Function.prototype.toString;

        // Used to detect host constructors (Safari > 4; really typed array specific).
        reHostCtor = /^\[object .+?Constructor\]$/;

        // Compile a regexp using a common native method as a template.
        // We chose `Object#toString` because there's a good chance it is not being mucked with.
        reNative = RegExp('^' +
            // Coerce `Object#toString` to a string.
            String(toString)
                // Escape any special regexp characters.
                .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
                // Replace mentions of `toString` with `.*?` to keep the template generic.
                // Replace thing like `for ...` to support environments, like Rhino, which add extra
                // info such as method arity.
                .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
        );
    };

    return function isNative(value) {
        !toString && prepare();
        var type = typeof value;
        return type == 'function'
            // Use `Function#toString` to bypass the value's own `toString` method
            // and avoid being faked out.
            ? (!('prototype' in value) || reNative.test(fnToString.call(value)))
            // Fallback to a host object check because some environments will represent
            // things like typed arrays as DOM methods which may not conform to the
            // normal native pattern.
            : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
    };

}());