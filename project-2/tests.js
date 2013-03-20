var assert = require("assert")

var dotpath = require('./index');

//test when the property is present
var test_string = 'part.key.attribute',
    expected = "woop woop",
    test_obj = {part: {key: {attribute: expected} }},
    find = dotpath(test_string),
    found = find(test_obj);

assert.equal(dotpath(test_string), expected);

//test when the property is not present
assert.deepEqual(find({}) || find() || find(null), undefined)
