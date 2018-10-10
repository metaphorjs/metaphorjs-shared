var list = [{a: 1}, {a: 4}, {a: 2}];

sortArray(list, "a"); // [{a:1},{a:2},{a:4}]
sortArray(list, function(item) {
    return item1.a;
}); // [{a:1},{a:2},{a:4}]
sortArray(list, {
    fn: function(item1, item2) {
        return item1.a - item2.a;
    },
    context: window
}); // [{a:1},{a:2},{a:4}]