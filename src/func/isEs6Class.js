
module.exports = (function(){
    var toString = Function.prototype.toString;

    function fnBody(fn) {
        return toString.call(fn).replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
    }

    return function isClass(fn) {
        return (typeof fn === 'function' &&
            (/^class[\s{]/.test(toString.call(fn)) ||
                (/^.*classCallCheck\(/.test(fnBody(fn)))) // babel.js
            );
    }
}());
