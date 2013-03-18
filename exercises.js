var assert = require('assert')

/***

these exercises are executable!

whenever you see something like `require('./example')`, you should
open up a file in the current directory called `example.js` (in vim,
do `:vsplit example.js`). at the bottom of your file, export your function
by writing `module.exports = <function name you want to export>`.

so, for example you might see:

  // *** EXERCISE 1:
  // please sir, i'd like to turn a string into an array!
  require('./exercise-1')("hello world")

then you should open `exercise-1.js` and write:

  module.exports = function(string) {
    return // make that thing work
  }

so, without further ado! let's talk about types: primitives and objects.

*** QUICK VIM NOTE: ***

in NORMAL mode:
* type `:vsplit filename` and hit <enter> to open a new vertical pane. `:split filename` <enter> will
  open a horizontal pane.
* to flip between panes, press <Ctrl-W> + <Up>, <Down>, <Left> or <Right>.
* remember `:!node %`? you should be using it a lot during this lesson.
  keep in mind that the `%` stands for the file in the pane you have focused!

***/

// first, the basic types:
var type

// an object. in javascript, everything can be treated like an object.
// an object is just a mapping of properties to attributes.
// you can declare an object like so:
type = {}

// a property is just a string.
type["greeting"] = "sup dudes"

console.log('type is:', type)

// if the property string only contains alphanumeric characters and underscores,
// you can also access it like so:

type.greeting = "this works too"

console.log('setting `type.greeting`:', type.greeting)

// same goes for declaring objects:
type = {
  'this needs quotes': 'yep'
, this_doesnt: 'nope'
}

// you can check if a key is present in an object with `in`, or `obj.key !== undefined`:

console.log('is this_doesnt in type?', 'this_doesnt' in type)
console.log('is type.this_doesnt defined?', type.this_doesnt !== undefined)

// you can loop over the keys of an object with `for(var key in <object>)` 
// loops.

console.log('listing keys and values of type ----')
for(var key in type) {
  // to look up a key from an object, use the `obj[<expression>]` syntax:
  console.log('  ', key, type[key])
}
console.log('----')


// so, everything in javascript can be thought of as an object.
// let's go with an easy example: arrays.
// arrays are objects with integer (0, 1, 2, 3, 4...) indices.

type = ['hi', 'there', 'guys']

// but they're also objects. 
type.thing = 'lol'

console.log('array property `type.thing`:', type.thing)

// so, we get into a bit of an issue here: for/in doesn't work quite
// as expected with objects:

console.log('listing keys and values of an array ----')
for(var key in type) {
  console.log('  ', key, type[key])
} 
console.log('----')

// it outputs "thing" even though we only care about the integer indices!
// instead, with arrays, you should always use `for(var i = 0; i < array.length; ++i)`
// style loops:

console.log('listing *just the integer keys and values* of an array ----')
for(var i = 0, len = type.length; i < len; ++i) {
  console.log('  ', i, type[i])
}
console.log('----')

// *** EXERCISE 1:
// using what we know about looping over arrays and creating objects,
// write a function that takes two arrays of equal length, and returns an object
// using the first array as the keys, and the second array as values.
// HINT: you can nest lookups: `out[lhs[i]]`!

var keys = ['gary', 'human', 'hat']
  , vals = ['busey', 'being', 'town']
  , expected = {gary: 'busey', human: 'being', hat: 'town'}

var your_function = require('./exercise-1')
  , your_result = your_function(keys, vals)

assert.deepEqual(your_result, expected)

// ---- moar objects ----

// functions are objects, too, that just happen to be callable.

var my_function = function() { 
  return my_function.value
}

my_function.value = 13

// as are regexen.

var my_regex = /([^\/]+)/g

my_regex.value = 26

// see?

console.log('my_function.value', my_function.value)
console.log('my_regex.value', my_function.value)

// *** EXERCISE 2:
// functions are objects! how can we use this to our advantage?
// well, there's a technique called "memoization" -- the theory is that 
// sometimes you have a big expensive function that will always return
// the same result if it's given the same argument.
//
// given that, write a function that:
// *  when called, looks for `<your_function_name>.cache` for an object
// *  if it's not there, it creates an empty object there.
// *  checks that cache object for the presence or absence of the first argument
// *  if `fn.cache[argument1]` is defined, returns that. if not, it should call the second argument
//    store it in `fn.cache[argument1]`, and return that value. 

var your_function = require('./exercise-2')
  , argument_one = 'random-'+~~(Math.random() * 10)
  , expected = Math.random()
  , result

assert.strictEqual(your_function.cache, undefined, 'Exercise 2: `<yourfunction>.cache should be undefined if it hasn\'t been called yet.')

result = your_function(argument_one, function argument_two() {
  return expected
})

assert.ok(your_function.cache, 'Exercise 2: <yourfunction>.cache should exist.')

assert.equal(result, expected, 'Exercise 2: your_function should return the value of `argument_two()`.')

result = your_function(argument_one, function argument_two() {
  assert.fail("this shouldn't get called at all, since `your_function` is memoized.")
})

assert.equal(result, expected, 'Exercise 2: your_function should return the memoized value.')

// --- primitives ---

// so we've found that several things are objects but serve different
// uses (functions, arrays, regexen). what about simpler objects, like
// boolean values (true, false), strings ("hello world"), and numbers
// (1, 2, 1.3333, Infinity)?
//
// well, it turns out that while they can be treated *like* objects,
// they're not quite fully-fledged objects.

var str = "hello world"

str.attribute = "yeah"

console.log('"hello world".attribute = "yeah": ', str.attribute)

// what the what?

var num = 12.

num.attribute = "yeah"

console.log('12..attribute = "yeah": ', num.attribute)

// okay, weird, weird

var bool = true

bool.attribute = "yeah"

console.log('(true).attribute = "yeah": ', bool.attribute)

// what's going on?!

// well, these types are "primitive" -- they're building block types.
// they can still be *treated* like objects (you can lookup attributes from them,
// in this case, `toUpperCase`):
console.log("string.toUpperCase()", "i am object, hear me roar".toUpperCase())

// but you can't assign new properties to them.
// so what's really happening?
// well, when JS detects that you're using a primitive as an object, it creates
// a **temporary** throwaway object that stands in for that value.
//
// so: "asdf".toUpperCase() is actually equivalent to `new String("asdf").toUpperCase()`.
// 
// JavaScript actually maps each primitive type to a function constructor:

console.log('"string".constructor.name =', "string".constructor.name)
console.log('12..constructor.name =', 12..constructor.name)
console.log('true.constructor.name =', true.constructor.name)

// *** Exercise 3:
//
// INTERNET FIELD TRIP!
// * background this process and open up a node REPL.
//    > str = "yeah"
//    "yeah"
//    > num = 21
//    21
// * now type `str.` at the next prompt and hit <TAB>.
// * you'll see two horizontal lists of methods.
// * pick two or three from the bottom list and write them down someplace (a piece of paper or something.)
// * open up google and search `mdn <that method name minus the str.>`
// * open up the article and read about the function.
// * open up `exercise-3.js` and use those methods in some way, shape or form, `console.log`-ing the
//   "before" and "after" values.
// * repeat for numbers.
// bonus points: document that file like i've written this one.

require('./exercise-3')
