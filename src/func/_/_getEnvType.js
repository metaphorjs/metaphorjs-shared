
var undf = require("../../var/undf.js");

module.exports = (function() {

    var env;

    return function(){
        if (!env) {
            env = {};
            var fn = new Function("return this"),
                top = fn();
            
            if (typeof window !== undf && top === window) {
                env.isWindow = true;
            }
            else if (typeof global !== undf && top === global) {
                env.isNode = true;
            }
        }

        return env;
    };
    
}());