
var async = require("../func/async.js"),
    extend = require("../func/extend.js"),
    bind = require("../func/bind.js"),
    nextUid = require("../func/nextUid.js"),
    isThenable = require("../func/isThenable.js"),
    emptyFn = require("../func/emptyFn.js"),
    isNumber = require("../func/isNumber.js"),
    error = require("../func/error.js"),
    raf = require("metaphorjs-animate/src/func/raf.js"),
    MetaphorJs = require("../MetaphorJs.js");

module.exports = MetaphorJs.lib.Queue = (function(){


var Queue = function(cfg) {

    var self = this;

    cfg = cfg || {};

    self._queue = [];
    self._map = {};
    self.id = "$$" + nextUid();
    self._f = bind(self._finish, self);

    for (var i in cfg) {
        self[i] = cfg[i];
    }
};


Queue.REPLACE = 1;
Queue.ONCE = 2;
Queue.MULTIPLE = 3;
Queue.ONCE_EVER = 4;


extend(Queue.prototype, {

    _queue: null,
    _map: null,
    _nextRequested: false,
    _running: false,

    currentItemNo: null,

    length: 0,
    id: null,
    async: true,
    auto: true,
    thenable: false,
    stack: false,
    context: null,
    onResult: null,
    onFinish: null,
    counter: 0,
    mode: Queue.MULTIPLE,

    add: function(fn, context, args, mode, prepend, async) {

        var self    = this,
            qid     = self.id,
            id      = fn[qid] || nextUid(),
            item    = {
                id: id,
                fn: fn,
                context: context,
                args: args,
                async: async,
                itemno: ++self.counter
            };

        mode = mode || self.mode;

        if (mode === Queue.ONCE_EVER && fn[qid]) {
            return fn[qid];
        }

        fn[qid] = id;

        if (self._map[id]) {
            if (mode === Queue.REPLACE) {
                self.remove(id);
            }
            else if (mode === Queue.ONCE) {
                return id;
            }
        }

        self._queue[prepend ? "unshift" : "push"](item);
        self._map[id] = item;

        self.length = self._queue.length;

        if (self.auto) {
            self.next();
        }

        return id;
    },

    append: function(fn, context, args, mode, async) {
        return this.add(fn, context, args, mode, false, async);
    },

    prepend: function(fn, context, args, mode, async) {
        return this.add(fn, context, args, mode, true, async);
    },

    remove: function(id) {
        var self = this,
            queue = self._queue,
            i, l;

        for (i = 0, l = queue.length; i < l; i++) {
            if (queue[i].id === id) {
                queue.splice(i, 1);
                break;
            }
        }
        delete self._map[id];
    },

    isEmpty: function() {
        return this.length === 0;
    },

    isRunning: function() {
        return this._running;
    },

    next: function() {

        var self    = this,
            item,
            res;

        if (self._running) {
            self._nextRequested = true;
            return;
        }

        self._nextRequested = false;

        item = self._queue[self.stack ? "pop" : "shift"]();
        self.length = self._queue.length;

        if (!item) {
            return false;
        }

        self._running = true;
        self.currentItemNo = item.itemno;

        delete self._map[item.id];

        var fn = function(){
            try {
                res = item.fn.apply(item.context || self.context, item.args || []);
            }
            catch (thrown) {
                error(thrown);
            }
            finally {
                if (isThenable(res)) {
                    res.then(self._f, self._f);
                }
                else {
                    self._finish(res);
                }
            }
        };

        var asnc = item.async || self.async || false;

        !asnc && fn();
        asnc === "raf" && raf(fn);
        asnc && asnc !== "raf" && async(fn, null, null, isNumber(asnc) ? asnc : 0);
    },

    _finish: function(result) {
        var self = this;
        self.onResult && self.onResult.call(self.context, result);
        if (self._running) {
            self._running = false;
            self.currentItemNo = null;
            if (self.auto || self._nextRequested) {
                if (self.next() === false) {
                    self.onFinish && self.onFinish.call(self.context);
                }
            }
            else {
                self.length === 0 && self.onFinish && self.onFinish.call(self.context);
            }
        }
    },

    $destroy: function() {

        var self = this;

        self._queue = null;
        self._map = null;
        self.context = null;
        self._nextRequested = false;
        self._running = false;
        self.next = emptyFn;

    }
}, true, false);

return Queue;
}());


