var assert = require('assert')
  , fs = require('fs')
  , size = ~~(Math.random() * 1024 * 1024 + (2 * 1024 * 1024))
  , prep = require('./garbage')
  , http = require('http')

// day 7: the event loop

// we've covered all sorts of things about
// JavaScript-the-language thus far: scopes of three flavors,
// custom types, and the nature of values (and objects) in JS.
//
// we finally have all the conceptual building blocks in place,
// and can take on more API- and environment-related concepts.
//
// we'll start with the most powerful -- and probably the trickiest
// -- aspect of JavaScript environments: the event loop.


// NOTE, since we're dealing with time in this lesson, each part
// takes kind of a bit of time to execute. if you finish a part,
// change this like to match the part you'd like to skip to!

var start = part7   // part1, part2, ... part7

// JavaScript was originally intended for the browser -- to provide
// advanced functionality to web sites, making them able to "react"
// to user events, whenever they happened.
//
// To contrast, more traditional languages (like Python, Ruby, C, etc)
// are designed to be run (more-or-less) top to bottom, and to exit
// immediately when their stack is exhausted.
//
// You can think of the stack as analogous to the runtime scope concept --
// that is, at any point the in your program, there'll be functions that were
// called to get you to where you are now. The stack is ordered by least recent
// at the top, and most recent at the bottom, ending with the function you're
// currently in. When you call a function, a new entry gets added to the stack;
// when you exit a function (through return, or just running to the end of the function),
// that entry gets removed.
//
// An illustration of the stack:
//
//
// <start>      </start>
//  \             /
//   a           a      function a() {
//    \         /         b()
//     b   b   b        }
//      \ / \ /
//       c   d          function b() {
//                        c()
//                        d()
//                      }
//
//                      a()
//
// In most languages, once the initial <start> stack entry is popped off, we'd
// exit the program.
//
// Not so in most JavaScript environments! In JavaScript, once there are no more 
// stack entries, we "yield" back to the event loop.
//
// The event loop is a list of functions that represent "things that might happen in the future".
// For instance, we might add a "click" listener in an HTML page. When the user clicks, the next time
// the event loop gets control it'll attempt to run that listener. It can be more definite than that, even:
// You might schedule a function to execute at a specified time -- 100 milliseconds from now -- and, once
// the event loop gets control back and 100ms have passed, it'll call that function:

start()

function part1() {
setTimeout(function() {
  console.log('world')
  part2()
}, 100)
console.log('hello')
}

function part2() {
// importantly, only one stack can be running at once -- the event loop can't
// yank back control from your code, or run other code side-by-side! so, if we
// scheduled something to happen 100ms later, it's not guaranteed to run 100ms later --
// it's guaranteed to run *as soon as* 100ms later, and maybe longer if some code
// is being greedy and not exiting back to the event loop.

var start = Date.now()
setTimeout(function() {
  part3(start)
}, 100)

// we've scheduled an event, above, and now we're going to be greedy
// and run a really long loop while we have execution.
for(var i = 0; i < 100000; ++i) {
  process.stdout.write('\r'+['-', '\\', '|', '/'][~~((Date.now() / 100) % 4)])
}
process.stdout.write('\n')

}

function part3(started) {

console.log('it took', Date.now() - started, 'ms instead of 100ms.')

// wow wow. so we can block other code from executing.
// you might have seen this on web pages -- the "Page is not Responding"
// bit -- that's the result of some really greedy JS (usually in an infinite loop.)
//
// it's important to note that while you may *define* a function during one stack, it may be
// called later, by another execution stack -- while still referencing values from the enclosing
// scope. this is fundamental to how JS works with the event loop.

var message = 'hello world' 

setTimeout(function() {
  // this function refers to `message` which is in an outer scope,
  // and it gets executed on a different stack.
  console.log('message is: ', message)
  part4()
}, 0)

message = 'gary busey'
}

function part4() {
  // importantly, it works both ways:
  var message = 'hello world'

  setTimeout(function() {
    console.log('message is: ', message)
    part5()
  }, 10)

  setTimeout(function() {
    message = 'modifying outer scope values from another stack.'
  }, 0)
}

function part5() {
// so, the fun part:
// it's been sort of hinted at above, but the order we make the setTimeouts in doesn't
// necessarily reflect the order they'll be called in. in theory, we loosely control "when"
// they happen with the second argument. What if we didn't, though?
//
// there will be situations where you'll schedule an operation and give it a callback
// but you *won't know* how long that operation will take -- and worse yet, it might
// be just one of a list of things you need to schedule, each with different durations!
//
// *** Exercise 1:
// Using the node.js `fs.readFile` api, write a function that takes a list of filenames
// and a callback. Get the contents of each of those files. Put them in an array in the
// order of the list, and call the callback argument with that array once they've all
// completed.
//
// For this exercise, read the files sequentially (read one file, put it in the list,
// read the next file, put it in the list).
//
// (i.e., given `['file1', 'file2', 'file3'], the callback should eventually be called
// with [<file 1 contents>, <file 2 contents>, <file 3 contents>]).
//
// reference <http://nodejs.org/api/fs.html#fs_fs_readfile_filename_encoding_callback>.
var files = prep(size, ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt']).sort(function() { return Math.random() * 2 - 1 })
  , your_function = require('./exercise-1') 
  , start = Date.now()

your_function(files, function(result) {
  var time = Date.now() - start
  for(var i = 0, len = files.length; i < len; ++i) {
    console.log(' --- checking ' +files[i]+' against result['+i+']')
    assert.equal(fs.readFileSync(files[i], 'utf8'), result[i], 'check content of '+files[i]+' against result['+i+']')
  }
  assert.equal(result.length, files.length)
  part6(time)
})
}


function part6(time_taken) {
// *** Exercise 2:
// Write a function that does the same thing as the above, but instead of reading the files
// sequentially, it should readFile all of the files at once and collect the results as they 
// come in. HINT: effective JS has a strategy for approaching for approaching this problem towards
// the end of the book, before "promises". 

var files = prep(size, ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt']).sort(function() { return Math.random() * 2 - 1 })
  , your_function = require('./exercise-2') 
  , start = Date.now()

your_function(files, function(result) {
  var time = Date.now() - start
  for(var i = 0, len = files.length; i < len; ++i) {
    console.log(' --- checking ' +files[i]+' against result['+i+']')
    assert.equal(fs.readFileSync(files[i], 'utf8'), result[i], 'check content of '+files[i]+' against result['+i+']')
  }
  assert.equal(result.length, files.length)

  console.log('three files in '+time+'ms')

  // it should be *at least* 200ms faster than the old version.
  assert.ok(time - time_taken < -200, 'it should be faster to read all of the files at once. (it took '+time_taken+'ms last time, it took '+time+'ms this time)')

  part7()
})
}

function part7() {
// so you can see that doing things in parallel is quicker than doing things sequentially (also known as 
// the "waterfall" approach), if a little more complicated.
//
// thus far, we've only used one approach for dealing with asynchronous apis:
// callbacks. largely, we've used node-style callbacks -- `function(error, data)` --
// which will be called when the async operation is done, whatever the result.
// other callback forms (notably, jquery) separate the error case from the success case:
// `oncomplete` vs. `onerror` handlers. whatever the particular flavor, callbacks are
// largely the same: this *one* thing will finish at this *one* time, and JS should call
// this *one* function later when that's done.

// what about recurring events? for example, you very rarely want to listen for just *one*
// click on a page, or when you're downloading a file, it'd be a lot faster to deal with it
// if you were notified *each* time we got a chunk of data instead of once at the end.
//
// solution: use event emitters!
//
// an event emitter emits events -- a name with associated data.
// whenever it emits an event, it calls all of the listeners it has registered with that event name
// with that data.
//
// var EventEmitter = require('events').EventEmitter
// var ee = new EventEmitter
// ee.on('something', function(x) { console.log(x + 2) })
// ee.emit('something', 10) // logs 12


// an example:
// let's request a page. instead of waiting for the entire thing to load, let's just print
// it to the screen in uppercase as it comes in.

var request = http.request({method: 'GET', host: 'neversaw.us', pathname: '/'}, function(response) {
  // response is an event emitter that represents a file-like thing.
  // we can "read" data from it, and eventually it'll end.

  // let's tell the response file that we want human readable characters,
  // not binary objects.
  response.setEncoding('utf8')

  response.on('data', function(data) {
    // as data comes in, print it to the screen, uppercased.
    console.log('---------- got a chunk -------------')
    console.log(data.toUpperCase())
  })

  response.on('end', function() {
    // the response ended! there's nothing more to read.
    console.log('all done reading neversaw.us')

    part8()
  })
})

// request is *also* a file-like thing, except it's one we're writing.
// that is to say, we'll write chunks of data, and then eventually end the file.
request.write('')
request.end()
}

function part8() {
  // we'll pick up more of this in the next lesson!

} 
