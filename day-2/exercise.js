var assert = require('assert')

/***

WELCOME TO DAY 2

Today we'll learn a bit more about:

* The magic of arrays
* How that magic works, in terms of "properties" and "descriptors"
* `undefined` and `null`
* How `undefined` and `null` work (by way of making your own value!)

now, this lesson is going to delve into some fairly advanced stuff,
so if you have questions, don't hesitate to ask me. the goal is to 
further develop your understanding of "how do objects work in JavaScript".

***/

// first, remember objects?
var obj = {}

// remember how i said "a property is just a string"?
obj.anything = 3
obj['some variable'] = 3
console.log('"a property is just a string"?', obj)

// well, a property is a bit more than a string.
// let's take a look at arrays.
var arr = []

console.log('"arr.length" is just a property ("length") that maps to: ', arr.length)
arr[0] = 'gary' 
arr[1] = 'busey'
arr[3] = 'cowboy castle'
console.log('"length" maps to: ', arr.length)

// whoa! so, setting integer properties (in order) on the array affects the length!
console.log('what\'s in arr?', arr)

// is there any other weirdness going on?
arr.length = 0
console.log('what\'s in arr?', arr)

// yep! that's weird. setting `arr.length = 0` forcibly removes the other indices! 
// hmm, what other weirdness can we find?


// remember when i said never to use `for(var key in <target>)` loops on arrays?
//    (NB: this is still true, never ever ever do it, this is just by way of example)
arr = [1,2,3]
arr.some_key = 3
var keys = []
for(var key in arr) {
  // google `mdn Array push`
  keys.push(key)
}

console.log('keys in my array: ', keys)

// note that "length" doesn't show up!
// isn't that odd? it's a property that has side effects on the object
// it's attached to when it's modified (can erase indicies), and can be
// modified by setting other properties! not only that, it doesn't show
// up in a loop over the properties of the array.
//
// what is this wizard magic?
var obj = {}

// google `mdn Object.defineProperty` after you're done reading this.
Object.defineProperty(obj, 'some_property', {
  enumerable: false
, get: function() { return Math.random() }
, set: function(value) { this.value = value; }
})

obj.some_property = 3
console.log("after setting `obj.some_property`", obj)
console.log("what's the value of `obj.some_property`?", obj.some_property)

keys.length = 0
for(var key in obj) { keys.push(key) }
console.log("what are the keys on `obj`?", keys)

// Okay. Some caveats must necessarily follow here.
// 1. `Object.defineProperty` is fairly new, in terms of an API. That means it's not available everywhere. 
// 2. This still doesn't cover the weird behavior of `arr = []; arr[0] = 1; arr.length == 1`. We'll get to that.
// 3. This API, though new, exposes existing functionality from all of the JavaScript engines -- it just makes
//    it possible to use through JS, and not just by browser implementors.

// So, what is a property?
//
// A property is: a key on an object and a `Descriptor`.
// The most basic properties are the ones we talked about last time: string keys to some value. These automatically
// create, under the covers, a descriptor that says:
//  * `enumerable`: yep, show this property in `for(var k in o)` loops
//  * `value`: the value is `value`.
//  * `configurable`: yep, you can change this property with `Object.defineProperty` (or use `delete obj.property` 
//    to remove it) later on down the line.
//  * `writable`: yes, we can change the value with a later assignment.

// so, it's not super important to be able to *use* `Object.defineProperty`, though it is nice to
// have when you're working in an environment that supports it -- like node.
// it **is**, on the other hand, important to understand what the API implies about the way objects
// in javascript work: that is, each property has a descriptor that contains:
//  * its value, if any
//  * its writability
//  * its configurability (via delete / Object.defineProperty)
//  * its enumerability (does it show up in `for(var i in x)` loops?)
//  * optionally, a getter function and/or a setter function.
//
// using this we can start to understand a bit of the weird behavior of `arr.length`: why it doesn't show up in 
// `for-in` loops, why setting it to `0` can clear out an array, etc. 
//
// let's look at the property descriptor for `arr.length`:
console.log('`[].length`, as a descriptor', Object.getOwnPropertyDescriptor(arr, 'length'))


// *** Exercise 1:
// Write a function that given an object and a value, defines a property named "beheadingOfRobespierre" (since
// we've been talking about "things that have been unusually truncated")
// on that object. The property should not show up in `for-in` loops.
// BONUS VIMPOINTS: instead of typing "beheadingOfRobespierre" in the other window,
// try typing "be" and hitting "<Ctrl-n>". Then type the next character you want.
//
// COMMENT: This vimtip seems to be wrong. These commands just move you to the
// beginning of the current word, the end of the current word, and then to the
// next line. Also the tests below check that `beheadingOfRobespierre` has a
// value of the second argument in the function, which wasn't part of the
// described requirements :O.
var my_object = {}
  , your_function = require('./exercise-1')
  , my_value = Math.random()
  , my_keys = []

your_function(my_object, my_value)

assert.equal(my_object.beheadingOfRobespierre, my_value, "Exercise 1: `my_object.beheadingOfRobespierre` should === `my_value`")
for(var key in my_object) {
  my_keys.push(my_object)
}
console.log(my_keys)
assert.equal(my_keys.length, 0, "Exercise 1: `beheadingOfRobespierre` shouldn't show up as a key on `my_object`")

// that's a *lot* to absorb, i know.
// but this is sort of a "nothing up my sleeves" sort of lesson, in terms of explaining JS.
console.log('typeof Proxy', typeof Proxy)

// if that printed "undefined", you need to change how you're running
// node (just for this lesson, I promise!):
//  instead of hitting <Esc>:!node %<Enter>
//  <Esc>:!node --harmony_proxies %
if(typeof Proxy === 'undefined') {
  return console.log('you need to run node differently to continue.')
}

// okay, so the `Proxy` object is YET ANOTHER really new API.
// again, it exposes functionality that *already existed* in JS,
// but was only available to implementors, **not** JS devs.
//
// so don't expect it to be around. we're using it as a teaching aid. :D

// so, let's talk about `undefined` and `null`.
// `undefined` and `null` can be thought of as singleton objects -- that is,
// there's only *one* of each of them in a given JS process.
//
// and they seem super special.
try {
  // you really never want to set `undefined` yourself -- it's something that JS automatically
  // gives you back when something you're looking for in your program isn't there: like `{}.doesnt_exist === undefined`.
  (undefined).some_value
  (undefined).some_value = 'something'

  // if you need to represent an empty value, use `null` instead. it has basically the same behavior
  // as `undefined`, but bestows a sense of "intention" -- that is, the programmer *intended* to leave
  // this result empty. 
  (null).some_value
  (null).some_value = 'something'
} catch(err) {
  console.log('attempting to get or set a property of `null` or `undefined` throws an error!')
}

// but it's important to think of them *as objects*, so let's build our own --
// we'll call it "grouchy".

var grouchy = Proxy.create({
  get: function(target, name) {
    // `toString` and `valueOf` are the two object-to-primitive coercion
    // properties -- they should be functions, and when called they should return
    // the "primitive" version of the object.
    if(name === 'toString' || name === 'valueOf') {
      return function() {
        return '<grouchy object>'
      }
    }
    throw new Error('cannot access grouchy object')
  }
, set: function(target, name, value) {
    throw new Error('cannot modify grouchy object')
  }
})

// now we have a grouchy singleton object.
try {
  grouchy.property
} catch(err) {
  console.log('accessing throws an error: ', err.message)
}

try {
  grouchy.property = 3
} catch(err) {
  console.log('setting throws an error: ', err.message)
}

console.log('when we turn it to a string: '+grouchy)

// so you can see -- `undefined` and `null` are just objects
// that throw exceptions when we try to access or modify any
// property on them.
//
// nothing magic.
// you could use Proxies to create an object that behaves like
// `[]`, too -- in that setting a new integer value changes the
// `length` value behind the scenes.

// *** Exercise 2:
// some languages, like Objective-C, have an object called "nil",
// that's a little friendlier than `grouchy`. Instead of throwing
// an error when you access a property of `nil`, it'll always return itself.
// see if you can implement this using the above `Proxy.create` code.
var nil = require('./exercise-2')

assert.strictEqual(nil.anything, nil.any_random_thing, "any property should be the exact same as any other property")
assert.strictEqual(nil.anything, nil, "any property should be nil")

// okay, so we've managed to create our own `nil` object.
// that's pretty cool -- we can see that `undefined` and `null` aren't
// really anything special, and thus are nothing to be afraid of.

