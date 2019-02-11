require("../../metaphorjs/dev/env.js");

var levenshteinDiff = require("../src/func/levenshteinDiff.js"),
    levenshteinMove = require("../src/func/levenshteinMove.js"),
    assert = require("assert");

it("should show diff", function(){

    var a = [1,2,3],
        b = [2,3,1,4];

    var diff = levenshteinDiff(a, b),  
        move = levenshteinMove(a, b, diff.prescription, function(item){
            return ""+item;
        });

        
    assert.deepEqual([ 'D', '-', '-', 'I', 'I' ], diff.prescription);
    assert.deepEqual([ 1, 2, 0, 'I' ], move);

});