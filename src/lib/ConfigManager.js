
var extend = require("../func/extend.js"),
    Observable = require("metaphorjs-observable/src/lib/Observable.js"),
    nextUid = require("../func/nextUid.js"),
    toBool = require("../func/toBool.js"),
    isArray = require("../func/isArray.js"),
    createGetter = require("metaphorjs-watchable/src/func/createGetter.js"),
    Watchable = require("metaphorjs-watchable/src/lib/Watchable.js");

module.exports = (function(){

    $$observable = null;

    var MODE_STATIC = 1,
        MODE_DYNAMIC = 2,
        MODE_SINGLE = 3;

    var ConfigManager = function(values, cfg) {
        if (!$$observable) {
            $$observable = new Observable;
        }

        var self = this;

        self.id = nextUid();
        self.values = {};
        self.propeties = {};
        self.cfg = cfg;

        var k, v;

        if (cfg.propeties) {
            for (k in cfg.propeties) {
                self.setProperty(cfg.propeties[k]);
            }
        }

        if (values) {
            self.calc(values, cfg.scope);
        }
    };

    extend(ConfigManager.prototype, {

        id: null,
        propeties: null,
        values: null,
        cfg: null,

        calc: function(values, scope) {
            var self = this,
                k, value, prop, setTo;

            self.values = {};

            for (k in values) {
                prop = self.setProperty({
                    name: k
                });
        
                if (prop.mode === MODE_STATIC) {
                    value = values[k];
                }
                else if (prop.mode === MODE_SINGLE) {
                    value = createGetter(values[k])(scope);
                }
                else {
                    prop.watchable = Watchable.create(
                        scope, values[k], self._onWatchableChange, self, {
                            userData: prop.name
                        }
                    );
                    value = prop.watchable.getLastResult();
                }

                value = self._prepareValue(value, prop);
                self.values[prop.name] = value;

                setTo = self.cfg.setTo || prop.setTo;
                if (setTo) {
                    setTo[prop.name] = value;
                }
            }
        },



        _prepareValue: function(value, prop) {

            switch (prop.type) {
                case 'int':
                    return parseInt(value);
                case 'float':
                    return parseFloat(value);
                case 'bool':
                case 'boolean':
                    return toBool(value);
                case 'array':
                case 'list':
                    return !isArray(value) ? [value] : value;
                case 'string':
                case 'str':
                    return "" + value;
            }

            return value;
        },

        _onWatchableChange: function(val, prev, name) {
            var self = this,
                prop = self.propeties[name],
                setTo = prop.setTo || self.cfg.setTo;

            value = self._prepareValue(val, prop);
            self.values[name] = val;
            if (setTo) {
                setTo[name] = val;
            }

            $$observable.trigger(this.id, name, val, prev);
            $$observable.trigger(this.id +'-'+ name, val, prev);
        },

        setProperty: function(prop) {
            name = prop.name;

            if (!prop.mode) {
                mode = MODE_STATIC;

                if (name[0] === '$') {
                    mode = MODE_DYNAMIC;
                    name = name.substr(1);
                }
                if (name[0] === '$') {
                    mode = MODE_SINGLE;
                    name = name.substr(1);
                }

                prop.mode = mode;
            }

            prop.setAs = prop.setAs || name;
            if (!this.propeties[name]) {
                this.propeties[name] = prop;
            }
            
            return prop;
        },

        getValues: function() {
            return this.values;
        },

        getValue: function(name) {
            return this.values[name];
        },

        on: function(name, fn, context, opt) {
            $$observable.on(this.id +'-'+ name, fn, context, opt);
        },

        un: function(name, fn, context) {
            $$observable.on(this.id +'-'+ name, fn, context);
        },

        onDestroy: function() {
            var self = this,
                id = self.id,
                k, prop;

            for (k in self.propeties) {
                prop = self.propeties[k];
                if (prop.watchable) {
                    prop.watchable.unsubscribeAndDestroy(self._onWatchableChange, self);
                }
                prop.watchable = null;
                $$observable.destroyEvent(id +'-'+ prop.name);
            }

            $$observable.destroyEvent(id);

            self.propeties = null;
            self.values = null;
            self.cfg = null;
        }
    });

    ConfigManager.MODE_STATIC = MODE_STATIC;
    ConfigManager.MODE_DYNAMIC = MODE_DYNAMIC;
    ConfigManager.MODE_SINGLE = MODE_SINGLE;

    return ConfigManager;

}());