var assert = require('assert')

/***

day five: manipulating receivers, and user-defined types.

***/

// so, we're just about done with the core of "JavaScript the language".
// last time we covered "static scope", "dynamic scope", and "runtime scope",
// and looked at how "receivers" are determined for the purposes of defining
// `this` wihin a function.
//
// it was exciting, i made diagrams.
//
//    ^
// 100|   /
//    |  /
//    | /     Excitement over time.
//    |/
//   0+----->
//    0      now
//
// today, we'll talk about manipulating receivers.

// first up, `function(){}.call` and `function(){}.apply`.
// these two methods are the swiss army knife of manipulating
// runtime scope.

var func = function(a, b, c) {
  return this.x + a + b + c
}

// func.call is variable arity.
// the first argument will be the `receiver` of
// the function call (`this` in the function).
//
// the rest of the arguments will be slotted into place like so:
//
// func.call(this, a, b, c, d ...)
// func(a, b, c, d ...)
//
console.log('func.call', func.call({x: 1}, 1, 2, 3))

// func.apply has an arity of 2: it only
// takes two arguments: `receiver` and `args`.
// args, in this case, is an array.
//
// this is useful for when you want to dynamically
// construct arguments for a function call.
//
// func.apply(this, [a, b, c, d])
// func(a, b, c, d)
//
console.log('func.apply', {x: 12}, [10, 20, 30])
console.log('func.apply', {x: 12}, [10].concat([1,2,3])) 

// *** Exercise 1:
// Write a function that accepts a single argument -- an array of numbers --
// and uses `Math.max` (be sure to look it
// up on MDN) to find the maximum of all of the provided arguments, without
// using any loops.

var your_function = require('./exercise-1')
  , num_args = ~~(Math.random() * 10) + 1
  , args = []
  , max = -Infinity
while(num_args--) {
  args.push(Math.random() * 100)
  if(args[args.length - 1] > max) {
    max = args[args.length - 1]
  }
}

assert.equal(your_function(args), max)

// *** Exercise 2:
// Without using any loops, turn `arguments` into an array and return it.
var your_function = require('./exercise-2')

assert.deepEqual(your_function.apply(null, args), args) 
assert.ok(Array.isArray(your_function.apply(null, args)))

// *** Exercise 3:
// Write a function that can be applied with a receiver (`this`) of 
// another function (henceforth referred to as "UrFunction") and an
// argument "UrArgument", and returns a variable-arity function "NewFunction" 
// that, when called, uses `apply` to call "UrFunction" with a receiver of "UrArgument" and
// the arguments from "NewFunction".
 
var your_function = require('./exercise-3')
  , my_object = {x: ~~(Math.random() * 10) + 1}
  , new_function
  , my_function

my_function = function(a, b) {
  return this.x + a + b
}
my_function.tie = your_function
new_function = my_function.tie(my_object)

assert.equal(new_function(1, 2), 1 + 2 + my_object.x)

// So, apologies for the relative difficulty of the last exercise, but
// it's an illustration: in ES5 (the current spec of JavaScript), there's
// *yet another* way to change the receiver and arguments of a function
// call.
//
// Google for `mdn function bind`.
//
// Cool. It should look pretty familiar! `bind` can be implemented with
// `.apply` -- and you just wrote most of it above!
//
// There are some specific properties that cannot be easily replicated --
// see https://github.com/kriskowal/es5-shim#shims for more info.

// ---
// so, let's recap what we know before we move on to the final bit.
//
// * Everything acts like an object.
// * An object is a series of properties.
// * Properties consist of a name, some metadata about the property, and a value.
// * Some values aren't objects, but try their hardest to act like objects. We call these values "primitives".
// * Every function gets a static scope that defines a series of names.
// * Every time a function is called, it creates a dynamic scope that maps values to the names from the static scope.
// * Every time a function is called, it creates a runtime scope that maps `this` to the receiver of the function call,
//   and `arguments` to an object that represents the arguments passed to the function call.
// * Inside a function's scope, you can access any variable defined in any of the enclosing scopes -- but not
//   their siblings.
// * A function call's receiver is defined by looking at the left hand side of the place of where it's called. 
// * You can modify a function's runtime scope using `func.call` and `func.apply`; and use these to modify `receiver`
//   and `arguments`. 

// Next exercise will talk about prototypical inheritance and user-defined types;
// and the last way we can manipulate the receiver of a function call.
