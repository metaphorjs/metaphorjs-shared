/** 
 * Filter by bool|string|regexp: 
 * 
 * Let x = array[i]<br>
 *  If x is bool and by is bool, return x === by;<br>
 *  If by is regex, return by.test(x)<br>
 *  If opt is true or not set, return x.contains(by)<br>
 *  If opt is false, return !x.contains(by)<br>
 *  If opt == "strict", return str(x) === str(by)<br><br>
 * 
 *  If x is an object, comparison goes for every property.
 *  If at least one property matches, x matches.
 */

var list = [1,2,3,"a",true];

filterArray(list, true); // [1,2,3,"a",true]
filterArray(list, true, "strict"); // [true]
filterArray(list, /a/); // ["a"]
filterArray(list, "1"); // [1]

/**
 * Filter by function
 */

filterArray(list, function(value){ return value == 2}); // [2]

/**
 * Filter by set of fields
 * Let x = array[i] and x is object.<br>
 *  Every key of "by" will be compared to the same key of "x". 
 *  Comparison goes as described in the first version of filterArray.<br>
 *  If key == "$", every key of x will be compared to by.$
 */

var list = [
    {a: 1, b: 2},
    {c: 3, d: 4}
];

filterArray(list, {a: 1, b: 10}); // [{a:1,b:2}]
filterArray(list, {a: 1, d: 4}); // [{a:1,b:2}, {c:3,d:4}]
filterArray(list, {$: 3}); // [{c:3, d:4}]