var assert = require('assert')

/***

day 4.

Last lesson covered static scopes and had you refactor a deeply
nested function into a slightly nicer form.

Today, we'll chat about dynamic scope, as well as runtime scope.

terms:

* "declare": create an entry in static scope for a variable name
* "define": set a variable to a value
* "static scope": the thing we talked about last lesson. we'll talk about it further today.
* "dynamic scope"
* "runtime scope"

NB: this nomenclature is just how I'm defining it (har har), so it's not particularly
google-able. it does describe a concept baked-in to JavaScript, though.

***/

// So! Let's review static scope. We talked about how it can be thought of as a list of objects
// that map a key (a variable name!) to a value (the value of that variable!).
//
// let's chat a bit more about the "lifetime" of static scope. 
var counter_factory
  , counter

counter_factory = function(start) {
  var count = start || 0
  return function increment() {
    return ++count
  }
}
// so, whenever we call `counter_factory()`, you can imagine
// that a new "scope" object gets pushed onto the scope list.
//
//    the scope right now (ignoring those `require` statements above):
//
//      <global>
//        └─ {counter_factory: <function>, counter: undefined}

counter = counter_factory()

// right when we call the `counter_factory` function
// the scope looks like this:
//
//    <global>
//        ├─ {counter_factory: <function>, counter: undefined}
//        └─ <counter_factory 0>
//            └─ {start: undefined, count: undefined} 
//  
// and then we execute `var count = start || 0` (and since we didn't give it an
// argument, `start === undefined`):
//
//    <global>
//        ├─ {counter_factory: <function>, counter: undefined}
//        └─ <counter_factory 0>
//            └─ {start: undefined, count: 0} 
//
// sweet, now we're back at <global> scope, and after the assignment, it looks like this: 
//
//      <global>
//        └─ {counter_factory: <function>, counter: <function>}

console.log('counter() === ', counter())

// let's pretend we're in that "increment" function that `counter_factory` returned,
// before it's run anything:
//
//    <global>
//        ├─ {counter_factory: <function>, counter: undefined}
//        └─ <counter_factory 0>
//            ├─ {start: undefined, count: 0} 
//            └─ <counter_factory anonymous function 0>
//                └─ {increment: <function>}
//
// note that since "increment" was declared as a function expression, the variable
// "increment" is only declared in the innermost scope.
//
// once we run through the function, "increment" has modified the scopes like so:
//
//    <global>
//        ├─ {counter_factory: <function>, counter: undefined}
//        └─ <counter_factory 0>
//            ├─ {start: undefined, count: 1} 
//            └─ <increment 0>
//                └─ {increment: <function>}
//
// note that `<counter_factory scope 0>.count` is now `1`.
//
// COMMENT: Shouldn't the above be <counter_factor 0> scope.count?
//
// how'd that happen?
//
// well, when you have a variable in a function, it attempts to look it up from the
// innermost scope to the outermost scope:
//
//    'count' in <increment 0>? nope.
//    'count' in <counter_factory 0>? yep! this is the `count` variable we're looking for!
//
// note that you can modify or set variables from outer scopes:

counter_factory = function(start) {
  var count
  return function increment() {
    count = count || start || 0
    count = count + 1
    return count
  }
}

counter = counter_factory()
console.log('verbose version: counter() === ', counter())

// `count` isn't assigned to anything in <counter_factory 0>, but
// since it's declared in that scope (with `var count`), it can still be
// assigned later, by an inner scope.
//
// that brings us to a brief aside...
//
// UNINTENTIONAL GLOBALS

counter_factory = function(start) {
  count = start || 0  // we removed the var bit, meaning it's not declared!
  return function increment() {
    count = count || start
    count = count + 1
    return count
  }
}

// what would happen if it *wasn't* declared in <counter_factory 0> using var? let's look:
//
//    'count' in <increment 0>? nope.
//    'count' in <counter_factory 0>? nope.
//    'count' in <global>? nope!
//    there aren't any more scopes to look in!
//
// since we're assigning `count` a value, JavaScript assumes that we want to declare it in the very
// last scope. (if we were just looking it up, JavaScript would throw a `ReferenceError` exception.)
// importantly, this only happens *when the code is executed*.
//
// so before we run the code, our global scope looks like so:
//
//    <global>
//        └─ {counter_factory: <function>, counter: undefined}
//
// then if we run:
//
//    counter = counter_factory()
//
// afterward, <global> looks like this:
//
//    <global>
//        └─ {counter_factory: <function>, counter: undefined, count: 0}
//
// there's a new variable there! that sucks!
// what if we were expecting to use that variable in `global` scope later?

counter = counter_factory()
count = 13
console.log('unintentional global counter() ===', counter())

// even worse, what if later on in our program, we assigned `count` to a "counter message" string?
count = 'you have %d counts!'
console.log('oh god, the humanity, counter() ===', counter())

// leaking globals is generally considered a bad thing, as it tends
// to happen "by accident".
// the primary culprit for leaked globals is to look for any `<variable> = <value>`,
// where you don't see a `var <variable>` declared anywhere in the code surrounding it.
//
// however, it does nicely illustrate that "scopes are just objects"!
// javascript is designed to be embedded into different environments -- the two primary
// ones being node.js and the DOM (that is, in a web page).
//
// part of embedding javascript is assigning "global scope" to an object.
// in browsers, it's `window`; in node, it's `global`.
//
// and it really is just an object:
console.log('globally available variable names: ', Object.keys(global))

// you can actually check if a variable is declared in global scope
// by checking the "global object" for a property with that variable name:
console.log('is count defined?', global.count !== undefined)

// or create new global variables by assigning it a new property:
console.log('is ephialtes defined?', global.ephialtes !== undefined)
global.ephialtes = 'kind of an ancient jerk'
console.log('what is ephialtes?', ephialtes)

// generally, when you see someone assign to a global object, it's because
// they want to explictly declare a variable as globally available.

// whew. that was quite an aside.

// *** Exercise 1:
// it's a tiny baby exercise.
// write a function that takes the provided function and executes it
// *without throwing an exception*. use the global object.
//
// NB: I am not advocating that you ever *do* this in production code,
// just that it is *possible*. :D
var your_function = require('./exercise-1')
  , triggered = false

your_function(function() {
  gary_busey++
  triggered = true
})

assert.ok(triggered, 'Exercise 1: should have called my function.')
assert.ok(typeof gary_busey != 'undefined', 'Exercise 1: should have defined gary_busey.')

// ===============================================================================================
//
// okay, thanks for bearing with me on that aside.
// let's take another look at the scope from the "good" `counter_factory`, above.
//
//    <global>
//        ├─ {counter_factory: <function>, counter: undefined}
//        └─ <counter_factory 0>
//            ├─ {start: undefined, count: 1} 
//            └─ <increment 0>
//                └─ {increment: <function>}
//
// you might be wondering why the `counter_factory` and `increment` scopes are suffixed with a `0`.
//
// well, that represents the fact that whenever you call `counter_factory()`, you're creating a 
// new scope instance:
//
//  var one, two
//  one = counter_factory(33)
//  two = counter_factory(12)
//
//    <global>
//        ├─ {counter_factory: <function>, one: <function increment>, two: <function increment>}
//        ├─ <counter_factory 0 "one">
//        |   ├─ {start: 33, count: 33} 
//        |   └─ <increment 0>
//        |       └─ {increment: <function>}
//        └─ <counter_factory 1 "two">
//            ├─ {start: 12, count: 12} 
//            └─ <increment 1>
//                └─ {increment: <function>}
//
// 
// so, you can call `two()` and it won't affect `one()` the next time you call it.
//
// this is theoretically kind of tricky: remember last lesson? we were able to take a function
// and display the scopes it contained *without running the function*.
//
// those are "static scopes" -- that is, the program can be statically analyzed to determine
// the "shapes" of scopes within it. Static analysis, in this case, means that we can divine
// things *about* the code without having to *run* the code. when i say "shape", i mean 
// "what properties will be available within a given static scope".
//
// the relationship between "static" and "dynamic" scope is analogous to the relationship
// between a map of a road and the actual experience of driving down the road.
//
//    ~~ an explanation: in which i wax lyrical about burgerville ~~
//
// from the map, you can tell there will be a burgerville along that road, but driving down
// the road yourself produces the experience of seeing that burgerville (and potentially, a milkshake.)
//
// every time you drive down the road, you might see the burgerville from a different angle,
// but it's always there. many different experiences, one map.
//
// that's how dynamic scope relates to static scope: every time you enter a function, you create
// a new dynamic scope -- what will this variable be *this time*. but the static scope of that
// function -- the map -- will always be the same.




// runtime scope
// =============

// the last type of scope we'll talk about today is called "runtime scope".
// you can think of it as a scope that always gets added on top of your current scope
// when you call a function. it always *declares* and *defines* two variables: 
// `this` and `arguments`. 
//
// our old concept of "counter_factory"'s scope chain
//
//    <global>                    {counter_factory: function, counter: function}
//      <counter_factory>         {start: number, count: number}
//         <increment>            {increment: function}
//
// and now with runtime scope:
//  
//    <global>                    {counter_factory: function, counter: function}
//      + runtime_scope           {this: object, arguments: args}
//        <counter_factory>       {start: number, count: number}
//          + runtime_scope       {this: object, arguments: args}
//            <increment>         {increment: function}
//               + runtime_scope  {this: object, arguments: args}
//
// remember that when we look up a variable name in a function, it goes from
// the innermost scope to the outermost; that means...
//
// *** whenever you enter a function, `this` and `arguments` change. ***
//
// so, we know that because they're automatically *declared* for each function,
// asking for `this` will always give us the innermost `this`, not any of the parents;
// but what are they automatically *defined* as?

var object = {}

object.method = function() {
  return this
}
console.log('object.method() === object', object.method() === object)
console.log('(object.method)() === object?', (object.method)() === object)
console.log('(0 || object.method)() === object?', (0 || object.method)() === object)

// `this` is defined to be the "receiver" of the function. 
// an aside on "Abstract syntax trees":
//
// remember sentence diagramming from school?
// programming languages can be diagrammed in a similar (though much more complete!) fashion.
//
// see, when you do:
//
//    var x = 3 + y
//
// that turns into a tree of:
//
//    var declaration
//      /     \
//    x    var definition
//             |
//             +
//            / \
//           3   y
//
// the heaviest operators (*, /, %, variable names, literals) sink to the bottom of the tree
// while the lighter operators (+, -, ==, ===, >) float to the top.
//
// the higher a node is, the later it'll get evaluated. essentially, you have to evaluate all of
// the children of a node before you start evaluating the node itself.
//
// operators can be ternary `x ? y : z`, binary `x * y`, or unary `++x`.
//
// importantly, `obj[key]` and `obj.property` can be thought of as follows:
//
//    in the case of obj[key]:          in the case of obj.property 
//
//    dynamic lookup                      lookup
//      /     \                           /   \
//    obj   expression                  obj   "property"
//             |
//            key
//
// as can the call operator, `counter(arg1, arg2, arg3)`:
//
//        call
//      /     \
//   counter  [argument, argument, argument]
//              |         |         |
//            arg1      arg2      arg3
//
// a little heady, to be sure, but important!
// understanding this will help you understand how the receiver is determined
// (and thus how `this` is assigned) when you call a function.
//
// so, from the above `obj.method()` and `(obj.method)()` have an AST like so:
//
//        call              
//      /     \
//    lookup   []
//    /   \
//  obj   "method"
//
// while the last one (`(0 || obj.method)()`, where `this !== obj`) looked like this:
//
//        call                ## An aside:
//      /     \               ==========================================================
//    `||`    []              If you want to run through how this executes, point at the
//    / \                     top node (`call`) with your finger. Run your finger down the
//   0  lookup                left (`||`), and then to the left of that `0`. When you get
//      / \                   to something that "stops", go back up one node, and write down
//    obj  "method"           what the left hand side is. Then trace down the right hand side
//                            of the node and do the same.
//                            
//                            using the tree to the left, here's the path you'd use:
//
//                                    step: 0 1 2 3 4 5 6 7 8 9 A B C   step | value      | returns
//                                a         a                   a   a   ========================================
//                               / \         \                 / \ /    0    |  call      |
//                              b   g         b   b           b   g     1    |  `||`      |
//                             / \             \ / \         /          2    |  0         | 0
//                            c   d             c   d   d   d           3    |  `||`      |
//                               / \                 \ / \ /            4    |  lookup    |
//                              e   f                 e   f             5    |  obj       | {method: function}
//                                                                      6    |  lookup    |
//                                          ^ finger position           7    |  "method"  | "method"
//                                            at step                   8    |  lookup    | {method: function}["method"]
//                                                                           |            | function
//                                                                      9    |  `||`      | 0 || function
//                                                                           |            | function
//                                                                      A    |  call      |
//                                                                      B    |  <no args> | []
//                                                                      C    |  call      | function()

// in JavaScript, the receiver is determined *only* during `call` nodes, and only if the
// first child on the left of the node is a `lookup` or `dynamic lookup`.
// 
// if the left hand side *is* a lookup, `this` in the function returned from the lookup
// will be the `obj` it was querying during this `call` operation.
// 
// hence: `obj.method()` makes `this === obj` inside of method during the call, because
// the left hand side of the call is `obj.method`, while `(0 || obj.method)()` does not
// set `this` to `obj`.

// if there's no automatically determined receiver, `this` will be set to the
// global object, whatever it is (`window` in browsers, `global` in node):
console.log('(0 || object.method)() === global', (0 || object.method)() === global)

// when using "use strict", `this` will be set to `undefined` if no receiver
// can be determined.
object.method = function() {
  "use strict"
  return this
}
console.log('"use strict" (0 || object.method)() === undefined', (0 || object.method)() === undefined)

// importantly, this "late-determined" receiver behavior 
// allows you to use a single function against multiple objects:
var obj1 = {}
  , obj2 = {}
  , fn

fn = function(key, val) {
  this[key] = val
  return this
}

obj1.set = obj2.set = fn

obj1.set('x', 12)
    .set('y', 23)

obj2.set('lol', 'rofl')
    .set('gary', 'busey')

console.log('obj1.set === obj2.set', obj1.set === obj2.set)
console.log('obj1 after setting', obj1)
console.log('obj2 after setting', obj2)

// or even:
var obj1 = {length: 12}

obj1.slice = [].slice

console.log('obj1.slice()', obj1.slice()) 


// since Array#slice works (roughly) like so:
function arrayslice() {
  var output = []
  for(var i = 0; i < this.length; ++i) {
    output.push(this[i])
  }
  return output
}
// it can work against *any* object that defines a `length`.
// (though it'll only be useful if that object defines a `length`
// and has integer numbered properties). this'll prove useful later!

// rest assured, this is not the *only* way to set the receiver of
// a function call: there are two other ways which we'll cover later,
// one of which has a lot to do with the other member of `runtime scope`:
// `arguments`.

// arguments is an array-like object that contains all of the argument values
// sent to your function, named or not, as well as a length denoting
// the number of argument values sent.

// using the arguments object, we can easily create "variable arity"
// functions -- "arity" being the number of arguments a function accepts.

var adder = function() {
  var start = 0
  for(var i = 0; i < arguments.length; ++i) {
    start += arguments[i]
  }
  return start
}

console.log('adder with 3 arguments', adder(1,2,3))
console.log('adder with 6 arguments', adder(1,2,3,4,5,6))
console.log('adder with no arguments', adder())

// you can call a function with less arguments than
// it actually defines, too:

var getset = function(x) {
  // remember memoization?
  console.log('getset x === undefined?', x === undefined, '# of args passed:', arguments.length)
  if(arguments.length === 0) {
    return getset._
  }

  return getset._ = x
}

getset()
getset(3)
console.log('getset returned ', getset())

// *** Exercise 2:
// Write a function that returns all of the arguments as an array.
var your_function = require('./exercise-2')
assert.deepEqual(your_function(1,2,3,4,5), [1, 2, 3, 4, 5]) 

// *** Exercise 3:
// Write a function that returns every odd-indexed argument
// as a list.
//
// COMMENT: does list === array
//
// NB: use modulo 2 (`a % 2 === 0`) to determine if a number
// is even.
var your_function = require('./exercise-3')

assert.deepEqual(your_function(1,2,3,4,5), [2, 4]) 
assert.deepEqual(your_function(100), [])
assert.deepEqual(your_function('green', 'lettuce', 'ketchup', 'mayo'), ['lettuce', 'mayo'])

// *** Exercise 4:
// Knowing what we now know about `runtime scope`, write a
// function that:
//
//  takes one argument, a value
//  preserves the receiver
//  returns a variable-arity function that takes N strings
//  and for each string, sets a property on the aformentioned receiver named by that string
//  and holding the value from the first function
//
// in other words, a function that takes a value and returns a function that lets me
// easily set a bunch of keys to that value at once.

var your_function = require('./exercise-4')
  , object = {}
  , fun

object.method = your_function

fun = object.method(14)

assert.ok(typeof fun === 'function')
fun('maple', 'cranberry', 'lime')
assert.equal(object.maple, 14)
assert.equal(object.cranberry, 14)
assert.equal(object.lime, 14)

console.log(
[ '         __               __ __                         '
, '    ____/ /___ ___  __   / // /    ____ _   _____  _____'
, '   / __  / __ `/ / / /  / // /_   / __ \\ | / / _ \\/ ___/'
, '  / /_/ / /_/ / /_/ /  /__  __/  / /_/ / |/ /  __/ /    '
, '  \\__,_/\\__,_/\\__, /     /_/     \\____/|___/\\___/_/     '
, '             /____/                                     ' ].map(function(x, idx) {
  return '\033['+(idx + 31)+'m' + x
}).join('\n')+'\033[0m'
)


