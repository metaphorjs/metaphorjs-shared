
var MetaphorJs = require("metaphorjs-shared/src/MetaphorJs.js"),
    extend = require("metaphorjs-shared/src/func/extend.js"),
    undf = require("metaphorjs-shared/src/var/undf.js"),
    isArray = require("metaphorjs-shared/src/func/isArray.js");


module.exports = MetaphorJs.lib.Color = (function(){


    var processSet = function(args, prev) {
        
        var val = [];

        if (args.length > 1 || 
            typeof args[0] === "number" || 
            typeof args[0] === "string") {

            var a1 = args[0],
                a2 = args[1],
                a3 = args[2],
                a4 = args[3];

            val = prev.slice();
            a1 !== undf && a1 !== null && (val[0] = a1);
            a2 !== undf && a2 !== null && (val[1] = a2);
            a3 !== undf && a3 !== null && (val[2] = a3);
            a4 !== undf && a4 !== null && (val[3] = a4);
        }
        else {
            val = args[0];
        }

        val[0] = parseFloat(val[0] || 0);
        val[1] = parseFloat(val[1] || 0);
        val[2] = parseFloat(val[2] || 0);
        val[3] = val[3] === 0 ? 0 : parseFloat(val[3] || 1);

        return val;
    },


    set = function(inModel, outModel, args, prev) {

        var val = processSet(args, prev);
        return convert(inModel, outModel, val);
    },

    convert = function(from, to, val, doRound) {
        var conv = from+"2"+to;
        if (from !== to) {
            if (conversion[conv]) {
                val = conversion[conv](val);
            }
            else if (conversion[from+"2rgba"] && conversion["rgba2" + to]) {
                val = conversion["rgba2" + to](
                    conversion[from+"2rgba"](val)
                );
            }
            else {
                throw new Error("Cannot convert " + from + " to " + to);
            }
        }

        if (doRound) {
            val = round(val);
        }

        return val;
    },

    round = function(input) {
        var val = input.slice();
        val[0] = Math.round(val[0] || 0);
        val[1] = Math.round(val[1] || 0);
        val[2] = Math.round(val[2] || 0);
        return val;
    },

    hex2full = function(short) {
        var r = short.substring(0,1).toLowerCase(),
            g = short.substring(1,2).toLowerCase(),
            b = short.substring(2,3).toLowerCase();
        return r+r+g+g+b+b;
    },

    
    conversion = {

        rgba2hex: function(rgba) {
            var r = Math.round(rgba[0]).toString(16),
                g = Math.round(rgba[1]).toString(16),
                b = Math.round(rgba[2]).toString(16);
    
            r.length === 1 && (r = "0"+r);
            g.length === 1 && (g = "0"+g);
            b.length === 1 && (b = "0"+b);
            
            return r + g + b;
        },
        
        hex2rgba: function(hex) {
            return [
                parseInt(hex.substring(0,2), 16),
                parseInt(hex.substring(2,4), 16),
                parseInt(hex.substring(4,6), 16),
                1
            ];
        },

        rgba2hsla: function(rgba) {
            var r = rgba[0] / 255;
            var g = rgba[1] / 255;
            var b = rgba[2] / 255;
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            var delta = max - min;
            var h;
            var s;

            if (max === min) {
                h = 0;
            } else if (r === max) {
                h = (g - b) / delta;
            } else if (g === max) {
                h = 2 + (b - r) / delta;
            } else if (b === max) {
                h = 4 + (r - g) / delta;
            }

            h = Math.min(h * 60, 360);

            if (h < 0) {
                h += 360;
            }

            var l = (min + max) / 2;

            if (max === min) {
                s = 0;
            } else if (l <= 0.5) {
                s = delta / (max + min);
            } else {
                s = delta / (2 - max - min);
            }

            return [
                h, 
                s * 100, 
                l * 100, 
                rgba.length > 3 ? rgba[3] : 1
            ];
        },

        hsla2rgba: function(hsla) {
            var h = hsla[0] / 360;
            var s = (hsla[1]||100) / 100;
            var l = (hsla[2]||100) / 100;
            var a = hsla.length > 3 ? hsla[3] : 1;
            var t2;
            var t3;
            var val;
        
            if (s === 0) {
                val = l * 255;
                return [val, val, val, a];
            }
        
            if (l < 0.5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }
        
            var t1 = 2 * l - t2;
            var rgba = [0, 0, 0, a];
    
            for (var i = 0; i < 3; i++) {
                t3 = h + 1 / 3 * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }
        
                if (t3 > 1) {
                    t3--;
                }
        
                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                } else if (2 * t3 < 1) {
                    val = t2;
                } else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    val = t1;
                }
        
                rgba[i] = val * 255;
            }
        
            return rgba;
        },
    
        hsva2rgba: function(hsva) {
            var h = hsva[0] / 60,
                s = hsva[1] / 100,
                v = hsva[2] / 100,
                a = hsva.length > 3 ? hsva[3] : 1,
                hi = Math.floor(h) % 6,

                f = h - Math.floor(h),
                p = 255 * v * (1 - s),
                q = 255 * v * (1 - (s * f)),
                t = 255 * v * (1 - (s * (1 - f)));
                
            v *= 255;
        
            switch (hi) {
                case 0:
                    return [v, t, p, a];
                case 1:
                    return [q, v, p, a];
                case 2:
                    return [p, v, t, a];
                case 3:
                    return [p, q, v, a];
                case 4:
                    return [t, p, v, a];
                case 5:
                    return [v, p, q, a];
            }
        },
    
        rgba2hsva: function(rgba) {
            var rdif,
                gdif,
                bdif,
                h,
                s,
    
                r = rgba[0] / 255,
                g = rgba[1] / 255,
                b = rgba[2] / 255,
                a = rgba.length > 3 ? rgba[3] : 1,
                v = Math.max(r, g, b),
                diff = v - Math.min(r, g, b);
    
            var diffc = function (c) {
                return (v - c) / 6 / diff + 1 / 2;
            };
        
            if (diff === 0) {
                h = 0;
                s = 0;
            } else {
                s = diff / v;
                rdif = diffc(r);
                gdif = diffc(g);
                bdif = diffc(b);
        
                if (r === v) {
                    h = bdif - gdif;
                } else if (g === v) {
                    h = (1 / 3) + rdif - bdif;
                } else if (b === v) {
                    h = (2 / 3) + gdif - rdif;
                }
        
                if (h < 0) {
                    h += 1;
                } else if (h > 1) {
                    h -= 1;
                }
            }
        
            return [
                h * 360,
                s * 100,
                v * 100,
                a
            ];
        },

        rgba2str: function(rgba) {
            return color2str("rgba", rgba);
        },
    
        hsla2str: function(hsla) {
            return color2str("hsla", hsla);
        },
    
        hsva2str: function(hsva) {
            return color2str("hsva", hsva);
        },

        str2rgba: function(str) {
            return parseString(str);
        },

        str2hsla: function(str) {
            return parseString(str);
        },

        str2hsva: function(str) {
            return parseString(str);
        }
    },

    
    color2str = function(model, color) {
        var vals = round(color.slice()),
            a = vals[3];
        if (a > 0 && a < 1) {
            vals[3] = a.toFixed(2);
        }
        return model + "(" + vals.join(',') + ")";
    },

    parseString = function(str) {
        var match = str.match(/[\d, \.]+/);
        if (match) {
            var parts = match[0].split(",");
            parts[0] && (parts[0] = parseInt(parts[0]));
            parts[1] && (parts[1] = parseInt(parts[1]));
            parts[2] && (parts[2] = parseInt(parts[2]));
            parts[3] && (parts[3] = parseFloat(parts[3]));
            return parts;
        }
        return [0,0,0,1];
    };


/**
 * @class MetaphorJs.lib.Color
 * @constructor
 * @param {string|MetaphorJs.lib.Color|array|null} color 
 * @param {string} model rgba|hsva
 */
var Color = function(color, model) {

    if (!model && color instanceof MetaphorJs.lib.Color) {
        model = color.model;
    }

    this.model = model || "rgba";
    this.color = [0,0,0,1];

    if (color) {
        this.setColor(color);
    }
}; 


extend(Color.prototype, {

    model: null,
    color: null,

    /**
     * Create object copy
     * @returns {MetaphorJs.lib.Color}
     */
    copy: function() {
        return new Color(this);
    },

    /**
     * @method
     * @param {string|MetaphorJs.lib.Color|array} color {
     *  hex code, color object or rgba array
     * }
     */
    setColor: function(color) {
        if (!color) {
            return;
        }

        var t = typeof color;

        if (t === 'string') {
            if (color.substring(0,1) === "#") {
                color = color.substring(1);
            }
            color = color.toLowerCase();
            if (color.length === 3) {
                this.setHEX(hex2full(color));
            }
            else if (color.length === 6) {
                this.setHEX(color);
            }
            else if (color.indexOf("rgba") !== -1) {
                this.setRGBA(parseString(color));
            }
            else if (color.indexOf("hsl") !== -1) {
                this.setHSLA(parseString(color));
            }
            else if (color.indexOf("hsv") !== -1) {
                this.setHSVA(parseString(color));
            }
        }
        else if (color instanceof MetaphorJs.lib.Color) {
            if (this.model === "rgba") {
                this.setRGBA(color.getRGBA());
            }
            else if (this.model === "hsva") {
                this.setHSVA(color.getHSVA());
            }
        }
        else if (isArray(color)) {
            if (this.model === "rgba") {
                this.setRGBA(color);
            }
            else if (this.model === "hsva") {
                this.setHSVA(color);
            }
        }
    },

    /**
     * @method
     * @param {string} hex 
     */
    setHEX: function(hex) {
        var a = this.color[3];
        this.color = convert("hex", this.model, hex);
        this.color[3] = a;
    },
    
    /**
     * Set hsla
     * @method setHSLA
     * @param {int} h
     * @param {int} s
     * @param {int} l
     * @param {float} a
     */
    /**
     * Set hsla
     * @method setHSLA
     * @param {array} hsla 
     */
    setHSLA: function() {
        this.color = set("hsla", this.model, arguments, this.getHSLA());
    },


    /**
     * Set hsva
     * @method setHSVA
     * @param {int} h
     * @param {int} s
     * @param {int} v
     * @param {float} a
     */
    /**
     * Set hsla
     * @method setHSVA
     * @param {array} hsva 
     */
    setHSVA: function() {
        this.color = set("hsva", this.model, arguments, this.getHSVA());
    },

    /**
     * Set rgba
     * @method setRGBA
     * @param {int} r
     * @param {int} g
     * @param {int} b
     * @param {float} a
     */
    /**
     * Set hsla
     * @method setRGBA
     * @param {array} rgba 
     */
    setRGBA: function() {
        this.color = set("rgba", this.model, arguments, this.getRGBA());
    },

    /**
     * Set alpha channel
     * @param {float} a 
     */
    setAlpha: function(a) {
        a = parseFloat(a);
        a < 0 && (a = 0);
        a > 1 && (a = 1);
        this.color[3] = a;
    },

    /**
     * Get color in given format
     * @param {string} format hex|rgba|hsla|hsva|rgbastr|hslastr|hsvastr
     * @param {boolean} floats 
     */
    getAs: function(format, floats) {
        switch (format) {
            case "hex":
                return this.getHEX();
            case "rgba":
                return this.getRGBA(floats);
            case "hsla":
                return this.getHSLA(floats);
            case "hsva":
                return this.getHSVA(floats);
            case "rgbastr":
                return this.getRGBAString();
            case "hslastr":
                return this.getHSLAString();
            case "hsvastr":
                return this.getHSVAString();
            default:
                return this.getHEX();
        }
    },


    /**
     * @method
     * @returns {float}
     */
    getAlpha: function() {
        return this.color[3];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getR: function(floats) {
        return this.getRGBA(floats)[0];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getG: function(floats) {
        return this.getRGBA(floats)[1];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getB: function(floats) {
        return this.getRGBA(floats)[2];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getH: function(floats) {
        return this.getHSVA(floats)[0];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getS: function(floats) {
        return this.getHSVA(floats)[1];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {int}
     */
    getV: function(floats) {
        return this.getHSVA(floats)[2];
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {array}
     */
    getHSLA: function(floats) {
        return convert(this.model, "hsla", this.color, !floats);
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {array}
     */
    getRGBA: function(floats) {
        return convert(this.model, "rgba", this.color, !floats);
    },

    /**
     * @method
     * @param {boolean} floats true to not round values to ints
     * @returns {array}
     */
    getHSVA: function(floats) {
        return convert(this.model, "hsva", this.color, !floats);
    },

    /**
     * @method
     * @returns {string}
     */
    getHEX: function() {
        return convert(this.model, "hex", round(this.color));
    },

    /**
     * @method
     * @returns {string}
     */
    getRGBAString: function() {
        return convert("rgba", "str", convert(this.model, "rgba", this.color));
    },

    /**
     * @method
     * @returns {string}
     */
    getHSLAString: function() {
        return convert("hsla", "str", convert(this.model, "hsla", this.color));
    },

    /**
     * @method
     * @returns {string}
     */
    getHSVAString: function() {
        return convert("hsva", "str", convert(this.model, "hsva", this.color));
    },

    toString: function(format) {
        return format ? this.getAs(format) : this.getHEX();
    }
});

return Color;

}());
