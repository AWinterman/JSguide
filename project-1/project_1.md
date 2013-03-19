# Project 1
### A Tiny Templating Language

Write a templating function that transforms strings like:

    hello {{ world }} how is your {{ weekday }} going?

into a function that takes an object and returns a rendered string like so:

    var tpl = your_function("hello {{ world }} how is your {{ weekday }} going?")
    tpl({
      world: 'dude'
    , weekday: 'tuesday'
    })  // == "hello dude how is your tuesday going?"

You'll need:

* RegExp literals `/\{\{\s*(\w+)\s*\}\}/`
* String slice, replace
* To understand how to create lists of functions.

Put your code into a file called `index.js` and export the template function.

You'll need to write tests: use the [assert module](http://nodejs.org/api/assert.html)
to make sure your code works. Put this code in a file called `test.js`.
