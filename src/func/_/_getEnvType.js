

module.exports = (function() {

    var env;

    return function(){
        if (!env) {
            env = {};
            var fn = new Function("return this"),
                top = fn();
            
            if (typeof window !== undefined && top === window) {
                env.isWindow = true;
            }
            else if (typeof global !== undefined && top === global) {
                env.isNode = true;
            }
        }

        return env;
    };
    
}());