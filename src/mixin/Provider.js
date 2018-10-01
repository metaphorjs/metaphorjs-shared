
var Provider = require("../lib/Provider.js"),
    MetaphorJs = require("../MetaphorJs.js");

module.exports = MetaphorJs.mixin.Provider = {

    /**
     * @type {Provider}
     */
    $$provider: null,

    $beforeInit: function() {
        this.$$provider = new Provider;
    },

    value: function() {
        var p = this.$$provider;
        return p.value.apply(p, arguments);
    },

    constant: function() {
        var p = this.$$provider;
        return p.constant.apply(p, arguments);
    },

    factory: function() {
        var p = this.$$provider;
        return p.factory.apply(p, arguments);
    },

    service: function() {
        var p = this.$$provider;
        return p.service.apply(p, arguments);
    },

    provider: function() {
        var p = this.$$provider;
        return p.provider.apply(p, arguments);
    },

    resolve: function() {
        var p = this.$$provider;
        return p.resolve.apply(p, arguments);
    },

    inject: function() {
        var p = this.$$provider;
        return p.inject.apply(p, arguments);
    },

    $afterDestroy: function() {

        this.$$provider.$destroy();
        this.$$provider = null;

    }
};