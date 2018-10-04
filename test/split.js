
require("../../metaphorjs/dev/env.js");

var split       = require("../src/func/split.js"),
    assert      = require("assert");



describe("split function", function(){

    it("should split with single-char separators", function(){

        var str = "a|b|c",
            parts = split(str, "|");

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("b", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should split with multi-char separators", function(){

        var str = "a||b||c",
            parts = split(str, "||");

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("b", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should split strings with empty parts if told so", function(){

        var str = "a||c",
            parts = split(str, "|", true);

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should ignore double separators", function(){

        var str = "a||c",
            parts = split(str, "|");

        assert.equal(1, parts.length);
    });

    it("should not split quoted parts (double quote)", function(){

        var str = "a|\"b|d\"|c",
            parts = split(str, "|");

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("\"b|d\"", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should not split quoted parts (single quote)", function(){

        var str = "a|'b|d'|c",
            parts = split(str, "|");

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("'b|d'", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should ignore escaped separators", function(){

        var str = 'a|b\\|c',
            parts = split(str, "|");

        assert.equal(2, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("b|c", parts[1]);
    });

    it("should not split this", function(){

        var str = '.item.plainFlags.returns.join(" | ")',
            parts = split(str, "|");

        assert.equal(1, parts.length);
    });

    it("should work with complex quotes", function(){

        var str = '.item.getChildren(\'param "|"\') | collect:"name \\" test " | join:", "',
            parts = split(str, "|");

        assert.equal(3, parts.length);
    });

    it("should not split quoted parts (single quote)", function(){

        var str = "a|'b|d'|c",
            parts = split(str, "|");

        assert.equal(3, parts.length);
        assert.equal("a", parts[0]);
        assert.equal("'b|d'", parts[1]);
        assert.equal("c", parts[2]);
    });

    it("should parse this", function() {
        var str = '.item.plainFlags.type | map:\'filter.typeRef\' | join:" | "',
        parts = split(str, "|");

        assert.equal(3, parts.length);
    });
});