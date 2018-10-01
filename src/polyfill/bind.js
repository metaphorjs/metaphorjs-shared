
var toArray = require("../func/toArray.js");

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }
  
      var aArgs   = slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP
                   ? this
                   : oThis,
                   aArgs.concat(toArray(arguments)));
          };
  
      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype; 
      }
      fBound.prototype = new fNOP();
  
      return fBound;
    };
  }