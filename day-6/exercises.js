var assert = require('assert')

// Day 6: prototypical inheritance and user defined types.

// this is the last language level "tricky" part of JavaScript.
// to understand this, let's talk about "hidden properties".
//
// A hidden property is a property that is only accessible to
// the underlying code that makes up the JavaScript engine.
//
// They're usually written in [[style]] notation -- where `style`
// is the name of the hidden property.
//
// By way of analogy, you can think of JavaScript like an iceberg.
// The part that you can see while writing it is all above the surface.
// The part that implementors work on is the part underneath the water.
// Hidden properties are part of this "unseen" portion of JavaScript --
// you can't directly interact with them unless the implementors make
// it visible to you somehow -- but just like an iceberg, the hidden portions
// support the visible portions.
// 
// Why does this matter? Well, let's take a look at a function within a function:

function shadow_example(a, b) {
  return function inner(a) {
    // in this scope, we're always talking about
    // the `a` that was passed to `inner` -- we can't
    // reach the outer `a` because it's been "shadowed"
    // by this inner scope. We can, however, reach out
    // to `b`, since it's in the scope chain and not
    // shadowed by local scope.
    return a + b
  }
}

// Objects actually work surprisingly similarly to the above.
// They have a hidden property, [[Prototype]], that points to
// another object.

console.log("{}.toString === Object.prototype.toString", {}.toString === Object.prototype.toString)
console.log(
    "{toString: function}.toString !== Object.prototype.toString"
  , {toString: function() { }}.toString !== Object.prototype.toString
)

// since in the latter example the object has a `toString` property directly
// on it, it "shadows" the object's [[Prototype]].toString.

// so what's this useful for?
// well, if a lot of objects share the same properties, we can save memory by
// storing those properties on a common object, and then pointing all of those
// objects [[Prototype]] property to that object.
//
// We've been playing around with builtin types a lot, where the [[Prototype]]
// has been already set up for you:

console.log('[].push === Array.prototype.push', [].push === Array.prototype.push)
console.log('"".charAt === String.prototype.charAt', "".charAt === String.prototype.charAt)
console.log('/regex/.exec === RegExp.prototype.exec', /regex/.exec === RegExp.prototype.exec)

// it's important to note that [[Prototype]] simply points to another object.
// And it's turtles all the way down: since [[Prototype]] points at an object,
// that object itself may have a [[Prototype]] that points at another object.

console.log(
    'RegExp.prototype.valueOf === Object.prototype.valueOf'
  , RegExp.prototype.valueOf === Object.prototype.valueOf
)

// This can be a little mind bending, so let's make some ASCII art
// (is there any conceptual issue that ASCII art can't properly express? If there is,
// I certainly don't want to know.)
//
//  Assume we have an array, 'example', that contains `['a', 'b', 'c']`.
//
//      Objects             Property Names
//      -----------------------------------------------------------------------------
//
//      Nothing             ** `Nothing` is represented by `null` in JavaScript, but is a bit special.
//       ^                     If you remember the `nil` lesson, you can think of this object as a special
//       | [[Prototype]]       value that returns `undefined` for any lookup.
//       |
//      Object.prototype    (toString, valueOf)
//       ^
//       | [[Prototype]]
//       | 
//      Array.prototype     (toString, push, pop, shift, unshift, etc.)
//       ^
//       | [[Prototype]]
//       |
//      ['a', 'b', 'c']     (0, 1, 2, length)
//
// So `example[0]` checks the lowest level for property named `0`, finds it, and returns `'a'`.
//
// `example.push` looks first at the lowest level, doesn't find it, then goes up a level and finds it.
//
// `example.toString` finds it on `Array.prototype` and doesn't progress up to `Object.prototype`.
//
// `example.valueOf` finds it on `Object.prototype` after checking `example` and `Array.prototype`.
//
// `example.derpHerp` progresses up the chain all the way to `Nothing`, which returns `undefined` for
// any lookup, and thus the value is `undefined`.
//
// The above is true for **every object**. That means it's true for `[]`, `{}`, `/regex/`, and, importantly,
// `function(){}`'s as well; not to mention primitives being coerced to an object. It's turtles all the way
// down, and this is why it's handy to conceptualize every value in JavaScript as an object.
//

// So, this is all neat, but how do we use [[Prototype]], if it's a hidden property?
// It has to do with functions:

var fn = function() {}
console.log('All of the properties of a fresh, new function:', Object.getOwnPropertyNames(fn))

// Let's ignore `arguments`, `length`, `caller`, and `name` for now and focus on
// the `prototype` property:
console.log('new functions automatically get a prototype property? ', 'prototype' in fn)
console.log('which contains the following non-enumerable property:', Object.getOwnPropertyNames(fn.prototype))
console.log('and `fn.prototype.constructor` === `fn`:', fn.prototype.constructor === fn)
console.log('and no two function prototype objects are the same?', (function(){}).prototype !== (function(){}).prototype)

// So, when we create a function, JavaScript really creates **two** objects! The function itself,
// which can have properties, and another object that is pointed to by `function.prototype`.
//
// This is where things get a little weird: `fn.prototype` does NOT mean that `fn`'s [[Prototype]]
// member points at `fn.prototype`. Chalk this up to poor naming.
//
// Instead, if you call `obj = new fn`, `obj`'s [[Prototype]] will point at `fn.prototype`.
// AGAIN, remember that `fn` and `fn.prototype` are *just* objects.
//
// For lack of a better term, I call these functions-as-constructors "user defined types".
// (They act a *lot* like classes in other dynamic languages, but are more bare-bones.)
// A user-defined type is comprised of two parts: a function constructor and a set of properties
// assigned to that function constructors prototype property.
//
// By convention, function constructors should be statements, and should be capitalized.
function Point2D(x, y) {
  this.x = x
  this.y = y
  // note the lack of a `return` statement!
}

// create a method called `add` that all `Point2D` instances
// should have access to:
Point2D.prototype.add = function(rhs) {
  return new Point2D(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z)
}

// create the objects using `new`:
var lhs = new Point2D(12, 12)
  , rhs = new Point2D(34, 34)

console.log(
  'lhs.add(rhs): '
, lhs.add(rhs)
)

// *** Exercise 1:
// Write a function constructor that accepts one argument
// and has a method called "exclaim(action)" that returns that argument
// added to the "action" argument.

var your_constructor = require('./exercise-1')
  , your_instance = new your_constructor('i have no mouth, but i must ')

assert.equal(your_instance.exclaim('scream'), 'i have no mouth, but i must scream')
assert.strictEqual(your_instance.exclaim, (new your_constructor).exclaim, 'use prototype to share methods across instances')

// The above raises a lot of questions:
// 1. Where does your constructor get `this` from? We never specified a receiver!
// 2. Why don't you have to return from your function constructor?
// 3. How do we get `this` in the `exclaim` method?
//
// Let's answer 'em:
// 1. "Where does my constructor get `this` from?"
//
// When you call `new function(arg, arg, arg)`
// JavaScript makes a new object whose [[Prototype]] member is
// set to `function.prototype`, and then sets the receiver of the
// function call to that new object -- so `this` is that new object inside
// of your constructor.
//
// 2. "Why don't you have to return from your function constructor?"
//
// This is closely related to the question "what happens when I return something from
// a function constructor?"
//
// When you call a function with `new`, JavaScript assumes the result will be (most importantly)
// an object instance, and will most likely be the new object instance it made for you,
// unless you tell it otherwise.
//
// With no return statement, it'll implicitly return the new object it made for you.
// With a return statement, well, things get a little more complicated.
//
// Specifically, for the return statement to actually *return* the value, it has
// to return an object instance -- not `null`, not `undefined`, and NOT a primitive
// value. If you return any of these kinds of values, JavaScript assumes you must be
// insane and just gives you back the new object you made instead.

function ReturnsString() {
  this.attr = 'trollolol string'

  return "a string"
}

function ReturnsBoolean() {
  this.attr = 'trollolol bool'

  return true
}

function ReturnsNumber() {
  this.attr = 'trollolol number'

  // this is hex format for numbers;
  // 0xDEADBEEF == 3735928559 in decimal
  return 0xDEADBEEF
}

function ReturnsNull() {
  this.attr = 'trollolol null'

  return null
}

function ReturnsUndefined() {
  this.attr = 'trollolol undefined'

  // a return with no value returns undefined.
  return
}

// examples of javascript treating us like a crazy
// person for returning a non-object-instance value:
console.log('return string', new ReturnsString())
console.log('return bool', new ReturnsBoolean())
console.log('return number', new ReturnsNumber())
console.log('return null', new ReturnsNull())
console.log('return undefined', new ReturnsUndefined())

// But, if we return an object instance:

function ReturnsObject() {
  this.attr = 'trollolol object'
  return {}
}

function ReturnsArray() {
  this.attr = 'trollolol array'
  return []
}

function ReturnsFunction() {
  this.attr = 'trollolol function'
  return function() {}
}

function ReturnsRegExp() {
  this.attr = 'trollolol regexp'
  return /regexp/
}

console.log('return object', new ReturnsObject())
console.log('return array', new ReturnsArray())
console.log('return function', new ReturnsFunction())
console.log('return regexp', new ReturnsRegExp())

// ... JavaScript regards us as sane, thoughtful citizens and
// returns the value we expect. Functions behave differently
// depending on how you call them. `new func()` behaves as above,
// whereas `func()` only returns what you explicitly return (and
// if you don't return anything, it returns `undefined`).

// 3. "How do we get `this` in the `exclaim` method?"
// Recall the lesson from day 4. `this` is always determined at
// call-time:

function Heinlein(start) {
  this.start = start
}

Heinlein.prototype.exclaim = function(end) {
  return this.start + end
}

var scifi = new Heinlein('the moon is')

console.log('method example:', scifi.exclaim(' a harsh mistress'))

// breaking it down:
// 
// scifi.exclaim(' a harsh mistress')
//
//        call
//        /  \
//   lookup  arguments
//     / \     |
//    /   \   literal -- 'a harsh mistress'
//  id    id
//   |     |
// scifi  exclaim
//
// as we discussed previously, a function call with a lookup on the left
// side will have the receiver set to the object pointed at by the left of the lookup.
// 
// so, we know the receiver will be `scifi`.
//
// further, when we lookup `exclaim` on `scifi`:
//
//  Nothing
//    ^
//    | [[Prototype]]
//    |
//  Object.prototype      ['toString', 'valueOf']
//    ^
//    | [[Prototype]]
//    |
//  Heinlein.prototype    ['exclaim']
//    ^
//    | [[Prototype]]
//    |
//  scifi                 ['start']
//
// we start at `scifi`, which doesn't have an `exclaim` property. we move to `Heinlein.prototype`,
// which does. We return the value that `Heinlein.prototype.exclaim` points to -- in this case,
// it's a function.
//
// so, we've got a function, and we know the receiver will be `scifi`.
// Importantly, if you called `Heinlein.prototype.exclaim(' a harsh mistress')`, `this` would be 
// `Heinlein.prototype`:
//
//          call
//          /  \
//     lookup  arguments
//       / \     |
//      /   \   literal -- 'a harsh mistress'
//     /     \
//   lookup   id
//   /  \     |
//  /    \    exclaim
// id     id
//  |       \
// Heinlein  prototype
//
// So, the left of the top lookup points at `Heinlein.prototype`, and the function we get is
// `Heinlein.prototype.exclaim`. When we call it, we get "undefined a harsh mistress" because
// `Heinlein.prototype.start` isn't defined.


// *** Exercise 2:
// Write a type that has two methods: `on` and `emit`.
//
// Instances should have a mapping of "event name" to "array of functions".
//
// `.on(event, listener)` should return the object itself, and
// add `listener` to the list of listeners for `event`.
//
// `.emit(event)` should call every listener in the list pointed
// at by `event` with the arguments after `event`, and return itself.

var your_type = require('./exercise-2')
  , your_instance = new your_type

assert.doesNotThrow(function() {
  your_instance.emit('no listeners yet')
})

!function() {
  var expected = Math.random()
    , got

  ;(new your_type).on('data', function(data) {
    got = data
  }).emit('data', expected)

  assert.equal(expected, got, 'Should forward arguments.')
}()

!function() {
  var count = 0
  
  ;(new your_type).on('data', function() { ++count })

  ;(new your_type).on('data', function() {
    ++count
  }).on('data', function() {
    ++count
  }).emit('data')

  assert.equal(count, 2, 'only the listeners between L384 and L388 should be called')
}()

// -----------------------------------------
// Chaining prototypes
//
// So, thus far all of our types have inherited from
// `Object.prototype`, since that's what the `prototype` member's [[Prototype]] is set to.
//
// Sometimes we want to specialize further than a single level.
// 
// For instance, the type you wrote in the last exercise, called an "EventEmitter", is
// a useful construct for other types to inherit from.
//

var EventEmitter = your_type

function PausableEventEmitter() {
  EventEmitter.call(this)

  this.paused = false
}

console.log(Object.getOwnPropertyNames(PausableEventEmitter.prototype))

// we get rid of the old prototype object entirely, and reset
// it to point at an INSTANCE of EventEmitter instead.
PausableEventEmitter.prototype = new EventEmitter

// the one useful thing our old prototype had was `.constructor`,
// so we reset that:
PausableEventEmitter.prototype.constructor = PausableEventEmitter

console.log(Object.getOwnPropertyNames(PausableEventEmitter.prototype))

PausableEventEmitter.prototype.emit = function() {
  if(this.paused) {
    return
  }

  // we can still call old EventEmitter methods on ourselves:
  EventEmitter.prototype.emit.apply(this, arguments) 
}

// and we can add new methods:
PausableEventEmitter.prototype.pause = function() {
  this.paused = true
}

PausableEventEmitter.prototype.resume = function() {
  this.paused = false
  this.emit('drain')
}

// and instantiate it like normal:
var pausable = new PausableEventEmitter

pausable.on('data', function(i) {
  console.log('pausable got data', i)
})

for(var i = 0; i < 10; ++i) {
  if(i % 2 === 0) {
    pausable.pause()
  }
  pausable.emit('data', i)
  pausable.resume()
}

// Again, a lot to unpack.
// Let's look at what we did, how it affects the prototype chain, and
// a common mistake.
// 
// NewType.prototype = new BaseType               Nothing 
// NewType.prototype.constructor = NewType          ^
// nt = new NewType                                 |
//                                                Object.prototype 
// ----------------------------------------------   ^
// we create a new constructor, called NewType.     |
// we create a new instance of BaseType.          BaseType.prototype
// we replace NewType.prototype with the BaseType   ^
//    instance.                                     |
// we reset the constructor property to point     NewType.prototype (new BaseType)
//    at NewType.                                   ^
// we instantiate NewType.                          |
//                                                  nt
//---------------------------------------------------------------------------------
// // WRONG                                       Nothing
// NewType.prototype = BaseType.prototype           ^
// NewType.prototype.constructor = NewType          |
// nt = new NewType                               Object.prototype
//                                                  ^
// ----------------------------------------------   |
// NewType.prototype **is** BaseType.prototype.   BaseType.prototype (with mangled .constructor)
// Any modification to NewType.prototype will       ^
//     appear on all instances of BaseType.         |
//                                                 nt
//
// We want to create a **new** instance of BaseType to act as our
// new type's `.prototype`, NOT reuse `BaseType.prototype` directly.
//
// REMEMBER: in your inherited type, you *should* call `BaseType.call(this[, arguments])`
// as the first thing your function constructor does. This ensures that each
// instance of `NewType` gets the instance properties that `BaseType` expects.


// *** Exercise 3:
// Write a function that takes a function constructor, creates a new
// type that inherits from it, and returns it.
//
// Your returned type should have a new method, "quoth", that can
// do whatever you want.

function ExampleType() {
  this.x = 12 
}

ExampleType.prototype.method = function() {

}

var your_function = require('./exercise-3')
  , YourType = your_function(ExampleType)

var instance = new YourType

assert.ok(instance.hasOwnProperty('x'))
assert.strictEqual((new YourType).quoth, (new YourType).quoth)
assert.strictEqual((new YourType).method, (new YourType).method)
assert.ok(instance instanceof ExampleType)
assert.strictEqual(Object.getPrototypeOf(instance), YourType.prototype)
assert.ok(Object.getPrototypeOf(instance) instanceof ExampleType)
assert.strictEqual(Object.getPrototypeOf(Object.getPrototypeOf(instance)), ExampleType.prototype)
assert.ok(!('quoth' in ExampleType.prototype))
assert.strictEqual(ExampleType.prototype.constructor, ExampleType)
assert.strictEqual(YourType.prototype.constructor, YourType)

// A Handy Shorthand:
// When I write types, I like to do the following:

function MyType() {

}

// create shorthands for `MyType` and `MyType.prototype`.
// This way I can change my type name easily.
var cons = MyType
  , proto = cons.prototype

proto.method = function() {

}

// and for inheriting:
function MyType() {
  BaseType.call(this)
}

// note the two assigments -- cons.prototype becomes new BaseType,
// proto becomes cons.prototype.
var cons = MyType
  , proto = cons.prototype = new BaseType

// and I immediately reset .constructor afterward.
proto.constructor = cons

// *** Exercise 4:
// Use `require` to import your Event Emitter type from exercise-2.
// 
// Subclass it.
// Add a `remove` method that removes an event listener given
// an event name and a function.
// Add a `once` method that uses `remove` and `on` to only listen
// for an event once. It should accept `event` and `listener`, and 
// return `this`.
// Export the subclass.

var YourEE = require('./exercise-4')
  , yee = new YourEE
  , expected = Math.random()
  , triggered = 0
  , ev = 'event-'+Math.random()
  , fired = 0

assert.ok(yee instanceof require('./exercise-2')) 

assert.doesNotThrow(function() {
  yee.remove('dne')
  yee.remove('dne', function() {})
  yee.remove()
})

yee.on(ev, function() {
  ++fired
})

yee.once(ev, function(data) {
  assert.equal(data, expected)
  ++triggered
})

yee.emit(ev, expected)
yee.emit(ev, expected + 2)
yee.emit(ev, expected - 2)
assert.equal(triggered, 1)

;(new YourEE()).emit(ev, expected)

assert.equal(fired, 3)
assert.strictEqual(yee.constructor, YourEE)

console.log()
console.log("YOU HAVE COMPLETED DAY 6")
console.log("TAKE SOME IBUPROFEN PROBABLY")
console.log("FOR THAT HEADACHE")

// ignore this, it's just to make an example work above:
function BaseType() {}
