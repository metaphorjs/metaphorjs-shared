

var extend = require("../func/extend.js"),
    isThenable = require("../func/isThenable.js"),
    isFunction = require("../func/isFunction.js"),
    isString = require("../func/isString.js"),
    undf = require("../var/undf.js"),
    isBool = require("../func/isBool.js"),
    instantiate = require("../func/instantiate.js");


var VALUE       = 1,
    CONSTANT    = 2,
    FACTORY     = 3,
    SERVICE     = 4,
    PROVIDER    = 5,
    globalProvider;

var Provider = function() {
    this.store  = {};
};

extend(Provider.prototype, {

    store: null,

    instantiate: function(fn, context, args, isClass) {
        if (fn.$instantiate) {
            return fn.$instantiate.apply(fn, args);
        }
        else if (isClass) {
            return instantiate(fn, args);
        }
        else {
            return fn.apply(context, args);
        }
    },

    inject: function(injectable, context, currentValues, callArgs, isClass) {

        currentValues   = currentValues || {};
        callArgs        = callArgs || [];

        var self = this;

        if (isFunction(injectable)) {

            if (injectable.inject) {
                var tmp = injectable.inject.slice();
                tmp.push(injectable);
                injectable = tmp;
            }
            else {
                return self.instantiate(injectable, context, callArgs, isClass);
            }
        }
        else if (isString(injectable)) {
            return self.resolve(injectable, currentValues);
        }
        else {
            injectable = injectable.slice();
        }

        var values  = [],
            fn      = injectable.pop(),
            i, l;

        for (i = -1, l = injectable.length; ++i < l;
                values.push(self.resolve(injectable[i], currentValues))) {}

        return Promise.all(values).then(function(values){
            return self.instantiate(fn, context, values, isClass);
        });
    },

    value: function(name, value) {
        this.store[name] = {
            type: VALUE,
            value: value
        };
    },

    constant: function(name, value) {
        var store = this.store;
        if (!store[name]) {
            store[name] = {
                type: CONSTANT,
                value: value
            };
        }
    },

    factory: function(name, fn, context, singleton) {

        if (isBool(context)) {
            singleton = context;
            context = null;
        }

        this.store[name] = {
            type: FACTORY,
            singleton: singleton,
            fn: fn,
            context: context
        };
    },

    service: function(name, constr, singleton) {
        this.store[name] = {
            type: SERVICE,
            singleton: singleton,
            fn: constr
        };
    },

    provider: function(name, constr) {

        this.store[name + "Provider"] = {
            name: name,
            type: PROVIDER,
            fn: constr,
            instance: null
        };
    },

    resolve: function(name, currentValues, callArgs) {

        var self    = this,
            store   = self.store,
            type,
            item,
            res;

        currentValues = currentValues || {};
        callArgs = callArgs || [];

        if (currentValues[name] !== undf) {
            return currentValues[name];
        }

        if (item = store[name]) {

            type    = item.type;

            if (type === VALUE || type === CONSTANT) {
                return item.value;
            }
            else if (type === FACTORY) {
                res = self.inject(item.fn, item.context, currentValues, callArgs);
            }
            else if (type === SERVICE) {
                res = self.inject(item.fn, null, currentValues, callArgs, true);
            }
            else if (type === PROVIDER) {

                if (!item.instance) {

                    item.instance = Promise.resolve(
                            self.inject(item.fn, null, currentValues)
                        )
                        .done(function(instance){
                            item.instance = instance;
                            store[item.name] = {
                                type: FACTORY,
                                fn: instance.$get,
                                context: instance
                            };
                        });
                }

                return item.instance;
            }

            if (item.singleton) {
                item.type = VALUE;
                item.value = res;

                if (type === FACTORY && isThenable(res)) {
                    res.done(function(value){
                        item.value = value;
                    });
                }
            }

            return currentValues[name] = res;
        }
        else {

            if (store[name + "Provider"]) {
                self.resolve(name + "Provider", currentValues);
                return self.resolve(name, currentValues);
            }

            if (self === globalProvider) {
                throw new Error("Could not provide value for " + name);
            }
            else {
                return globalProvider.resolve(name);
            }
        }
    },

    $destroy: function() {
        this.store = null;
    }

}, true, false);

Provider.global = function() {
    return globalProvider;
};

globalProvider = new Provider;

module.exports = Provider;