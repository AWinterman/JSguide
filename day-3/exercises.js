// NOTE: before you run this lesson,
// run the following command in this directory:
//
//  npm install episcope esprima request
//

var assert = require('assert')
  , episcope = require('episcope')
  , esprima = require('esprima')
  , scopes = require('episcope/scopes')
  , bindings = require('episcope/bindings')
  , fs = require('fs')

/***

day 3!

Yesterday's lesson covered "properties" and "descriptors":
we explored getters and setters and implemented a `nil` object;
ideally in the process we demystified certain behaviors -- `[].length`,
`undefined`, `null`, etc.

Today we're going to cover scoping -- more specifically, **static** scoping.

***/

// When we're talking about scoping, we're talking about
// how the JS runtime finds the value pointed at by a variable
// name during execution. JavaScript's scoping behavior enables
// the concept of "closures", that is, functions that reference
// variables from an outer scope at some point down the line.
var outer_scope_variable = 13
  , func
  , mul

func = function(rhs) {
  // this function "closes over" `outer_scope_variable`.
  return rhs + outer_scope_variable
}

console.log('func adding outer_scope_variable to argument: ', func(12))

// Function that takes a value and returns a function.
func = function outer(rhs) {
  return function inner(lhs) {
    // this function "closes over" `rhs`, whatever it is.
    return lhs * rhs
  }
}

mul = func(3)
console.log('func multiplying an argument by an argument provided to an enclosing function', mul(3))

// importantly, whenever we call that func, it returns an entirely new
// function, with an entirely new closed-over value.
console.log('func(3) === func(3): ', func(3) === func(3))


// you can think of a level of scope like a javascript object, actually:
/*
    inner = {lhs}
  , outer = {rhs}
  , <global> = {outer_scope_variable: 13, func, mul}

  so when we're in "inner", when we look up "lhs", it'll start looking
  for a property called "lhs" on the "inner" variable above. of course, it'll
  find it immediately and return whatever that value is.

  when we're in "inner", imagine we did something like so:

  func = function outer(rhs) {
    return function inner(lhs) {
      console.log(func.toString()) // <-------- this line here

      return lhs * rhs
    }
  }

  well, we'd look at the `inner` scope for a property called `func`.
  we wouldn't find it.

  then we'd look at the `outer` scope for that property.
  we still wouldn't find it.

  finally, we'd look at the <global> scope for "func", and we would find it!
  it would point to the function called "outer". woo.
*/

// *** Exercise 1:
// Write a function that takes a string ("haystack") and returns a function.
// That returned function should take another string ("needle") and return
// "haystack.indexOf(needle)"

var your_function = require('./exercise-1')
  , corpus = 'national american butter eating contest nashville TN 2013'
  , your_inner_function = your_function(corpus)
  , choices = [
      ['tion', corpus.indexOf('tion')]
    , ['butter', corpus.indexOf('butter')]
    , ['ash', corpus.indexOf('ash')]
    ]
  , choice = ~~(Math.random() * (choices.length - 1))

assert.equal(
    your_inner_function(choices[choice][0])
  , choices[choice][1]
  , "Exercise 1: your_inner_function('"+choices[choice][0]+"') should === "+choices[choice][1]
)

// part 2: defining new variables in a given scope.
// there are four ways to declare a variable in a scope:
//    * declaring it as an argument of your function (as in `function(declareThis) { }`)
//    * or using the `var` statement (as in `var x` or `var x = 1, y = 2, z`).
//    * as part of a `try { } catch(err) { }` statement (in this case, defining `err`).
//    * as a "named function statement":
//
//      function named() {
//        return 1
//      }
//
//      which will declare "named". this one is a bit special and we'll get to it in a bit.
//
// it's important to note that the `var` statement *defines* the variable for the entire 
// body of the function:

console.log('accessing x causes a ReferenceError: ', function() {
  try {
    return x
  } catch(err) {
    return err.constructor.name +': '+err.message
  }
}()) 

console.log('accessing x does not cause a ReferenceError: ', function() {
  return x

  // even if we never actually *execute* `var x` as part of the function execution,
  // it's still defined (just with a value of `undefined`).
  var x = 3
}())

// essentially, the following two functions are equivalent:
function decl1() {
  for(var i = 0; i < 10; ++i) {
    // do stuff
  }
  var x = 1
  return x
}

function decl1() {
  var x, i
  for(i = 0; i < 10; ++i) {
    // do stuff
  }
  x = 1
  return x
}
// that is, both of the variable declarations get hoisted
// to the top of the function, but their assignment **does not**.


// *** Exercise 2:
// Write a function that returns a function that takes one argument. 
// Outside of this function, declare a variable and assign it a value.
// Inside the first function, declare one variable before the return statement, and one after.
// In the innermost function, declare another variable.

var your_function = require('./exercise-2')
  , your_source = fs.readFileSync('./exercise-2.js', 'utf8')
  , your_ast = esprima.parse('function root() { '+your_source+'}')

assert.equal(typeof your_function, 'function')
console.log('YOUR SCOPES:')
function recurse(at, i, out) {
  out = out || []

  var ast = scopes(at)
    , ids

  ast.forEach(function(ast) {
    ids = []
    bindings(ast).forEach(function(item) {
      ids.push(item.name)
    })

    out.push(pad(i)+'\\in '+ast.type+': ' +JSON.stringify(ids))
    recurse(ast, i + 1, out)
    out.push(pad(i)+'/')
  })

  return out
}

function pad(n) {
  var out = []
  for(var i = 0; i < n; ++i) {
    out.push('  ')
  }
  return out.join('')
}
console.log(recurse(your_ast, 0).join('\n'))

// *** Exercise 2, continued:
// rename your variables in that file. move them around. add arguments, remove
// arguments. add a `try { } catch(err) { }` block someplace.
// see how the scopes change.

// Function scoping.
// --------------------------
//
// I mentioned earlier that there are four ways to declare a variable in a scope.
// One being var statements -- which we found out get declared for the *entire body* 
//
// There are 2 ways to declare a function, and one of them has two "flavors":
//
//    Function expressions -- that is, functions with or without names that appear in
//      an "expression": `var x = function() {}`, `var y = function zzz() { }`.
//      these act like `var` declarations -- they're defined everywhere within the enclosing
//      function, but only assigned at the line where you wrote them.
//
//      named function expressions -- var x = function name() { } -- are useful for otherwise-anonymous functions
//      that would like to call themselves. `name` in this case is only defined inside of the function, nowhere
//      else.
var example = function() { }
!(function() {
  // another function expression
})()
var named = function lol() {
  return lol()
}
//
//    Function statements -- function statements *must have names*. Unlike var statements, which
//      get defined but NOT assigned, these functions are defined AND assigned immediately as soon
//      as your function starts executing:
var example = function() {
  return things()

  // even though "things" is not reachable, it is
  // nevertheless hoisted to the top of the function and is
  // available immediately.
  function things() {
    return 'hello world'
  }
}
console.log('named function statement "hoisting":', example())

// function statements are really useful for flattening
// out deeply nested callbacks:

var example = function(ready) {
  fs.readFile('./exercise-1.js', 'utf8', function(err1, file1) {
    fs.readFile('./exercise-2.js', 'utf8', function(err2, file2) {
      fs.readFile('./exercises.js', 'utf8', function(err3, file3) {
        if(err1 || err2 || err3)
          return ready(err1 || err2 || err3)

        ready(null, {
           'exercise_1': file1
         , 'exercise_2': file2
         , 'exercise_3': file3
        })
      })
    })
  })
}

// take a look at how the scoping mirrors the nested functions:
console.log('a deeply nested function: ')
console.log(recurse(esprima.parse('+'+example), 0).join('\n'))


// vs:
var example = function(ready) {
  var files = {}
    , error

  // we return here, indicating that the next
  // steps happen later on the event loop.
  return fs.readFile('./exercise-1.js', 'utf8', got_file_1)

  function got_file_1(err, file_1) {
    error = err
    files.exercise_1 = file_1
    fs.readFile('./exercise-2.js', 'utf8', got_file_2)
  }

  function got_file_2(err, file_2) {
    error = error || err
    files.exercise_2 = file_2
    fs.readFile('./exercises.js', 'utf8', got_file_3)
  }

  function got_file_3(err, file_3) {
    error = error || err
    files.exercise_3 = file_3
    if(error) {
      return ready(error)
    }
    ready(null, files)
  }
}
// take a look at how the scoping mirrors the nested functions:
console.log('a function using hoisted function statements: ')
console.log(recurse(esprima.parse('+'+example), 0).join('\n'))

// the second example, though longer vertically, uses closures
// and hoisted named functions to break apart the deeply nested
// structure.

// *** Exercise 3:
// Your turn! I've included a file (exercise-3-base.js) that
// is deeply nested.
//
// Your job is to make it look like the second example from above,
// using named function expressions.

var original = require('./exercise-3-base')
  , original_result
  , spin

original(
    'http://neversaw.us/'
  , 'http://neversaw.us/'
  , 'http://neversaw.us/'
  , after_original
)
spin = spinner('requesting several sites ')

function after_original(err, result) {
  spin.end()

  var your_function = require('./exercise-3')
    , your_source = fs.readFileSync('./exercise-3.js', 'utf8')
    , your_ast = esprima.parse('function root() { '+your_source+'}')
    , pretty = recurse(your_ast, 0)

  original_result = result

  console.log('original function: ')
  console.log(recurse(esprima.parse('function root() {'+fs.readFileSync('./exercise-3-base.js')+'}'), 0).join('\n'))

  console.log('your function: ')
  console.log(pretty.join('\n'))

  var expect = [  
      '\\',
      '  \\',
      '    \\',
      '    /',
      '    \\',
      '    /',
      '    \\',
      '    /',
      '  /',
      '/']
  for(var i = 0, len = expect.length; i < len; ++i) {
    assert.equal(pretty[i].indexOf(expect[i]), 0, 'your function\'s scope should look like \n'+expect.join('\n')+'\n')
  }

  spin = spinner('requesting several sites ')
  your_function(
      'http://neversaw.us/'
    , 'http://neversaw.us/'
    , 'http://neversaw.us/'
    , after_yours 
  )
}

function after_yours(err, result) {
  spin.end()
  assert.deepEqual(result, original_result, 'your function should get the same results as the original')

  // congratulations! next time we'll talk about
  //
  //  ______   ___   _    _    __  __ ___ ____   ____   ____ ___  ____  _____ ____  
  // |  _ \ \ / / \ | |  / \  |  \/  |_ _/ ___| / ___| / ___/ _ \|  _ \| ____/ ___| 
  // | | | \ V /|  \| | / _ \ | |\/| || | |     \___ \| |  | | | | |_) |  _| \___ \ 
  // | |_| || | | |\  |/ ___ \| |  | || | |___   ___) | |__| |_| |  __/| |___ ___) |
  // |____/ |_| |_| \_/_/   \_\_|  |_|___\____| |____/ \____\___/|_|   |_____|____/ 
  //
  // specifically, `this`, `arguments`, and we may even get into user defined types! 

  console.log('\033[32m'+
[ '       __                             _ __  __           __               _____'
, '  ____/ /___  ____  ___     _      __(_) /_/ /_     ____/ /___ ___  __   |__  /'
, ' / __  / __ \\/ __ \\/ _ \\   | | /| / / / __/ __ \\   / __  / __ `/ / / /    /_ < '
, '/ /_/ / /_/ / / / /  __/   | |/ |/ / / /_/ / / /  / /_/ / /_/ / /_/ /   ___/ / '
, '\\__,_/\\____/_/ /_/\\___/    |__/|__/_/\\__/_/ /_/   \\__,_/\\__,_/\\__, /   /____/  '
, '                                                             /____/            '].join('\n')+'\033[0m')

}

function spinner(msg) {
  var out = ['/', '-', '\\', '|', '/', '-', '\\', '|']
    , interval = setInterval(spin)

  return {
    end: function() { process.stdout.write('\n'); clearInterval(interval) }
  }

  function spin() {
    process.stdout.write('\r' + msg + ' ' +out[(~~(Date.now() / 100) % out.length)])
  }
}
