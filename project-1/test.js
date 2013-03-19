var assert = require('assert')

var example_template = "hello {{ world }} how is your {{ weekday }} going?";
    tpl = require("./index")(example_template),
    obj = {world: 'dude', weekday: 'tuesday'},
    expected = "hello dude how is your tuesday going?",
    result = tpl(obj);


console.log(result, expected);
assert.equal(result, expected);

