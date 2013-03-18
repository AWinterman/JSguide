//Part A.
//
//I picked anchor, constructor, and link.
//
//Write a function of three arguments that checks to make sure it's arguments
//are native strings, and returns its first argument anchored to its second and
//linked to its third.


var assert = require('assert');


var anchorNative = function(text, name, url){
    for (var argIdx = 0; argIdx < arguments.length; ++argIdx){
        //make sure they're all native, meaning the constructor is ''
        //if it isn't make it so.
        //
        //There are easier ways to do this for strings, but this would work for
        //an arbitrary type, if we changed the rhs of the deep equals, of
        //course.
        if (arguments[argIdx].constructor() === ''){
            arguments[argIdx] = ''.constructor(arguments[argIdx])
        }
    }
    return text.anchor(name).link(url);
}


var expected = '<a href="undefined"><a name="1">hello</a></a>',
    result  = anchorNative("hello", 1);

assert.equal(expected, result);

//Part B
//
//
var num = 21;
// > num.
// num.__defineGetter__      num.__defineSetter__      num.__lookupGetter__
// num.__lookupSetter__      num.constructor           num.hasOwnProperty
// num.isPrototypeOf         num.propertyIsEnumerable  num.toLocaleString
// num.toString              num.valueOf
// 
// num.constructor           num.toExponential         num.toFixed
// num.toLocaleString        num.toPrecision           num.toString
// num.valueOf

//Picking toLcaleString, toPrecision, and valueOf

//looks like Number.toLocaleString just handles commas vs. periods thousands and
//decimal seperators correctly.
//
//Number.toPrecision converts a number to one with a given number of
//significant figures
//
//valueOf is not very exciting. I'm going to look at toFixed instead, which
//deterimines how many figures to include after the decimal point. Seems
//related to toPrecision.

//Write a function which compares a number with two significant figures to a
//number with two values after the decimal point. Make sure these are rendered
//correctly for the user's locale.

var compareSigDec = function(num, n){
    if (n === undefined){
        var n = 2
    }
    var sig = parseFloat(num.toPrecision(n)).toLocaleString(),
        dec = parseFloat(num.toFixed(n)).toLocaleString();
    //toLocaleString is behaving funny on node.
    //It should be inserting commas (I'm definitely in an english locale), and
    //it's not. :(
    return [sig, dec]
}

var num = 123456.123456,
    expected = ['120000', '123456.12'],
    returned = compareSigDec(num);

console.log(expected, returned);
assert.equal(expected[0], returned[0])
assert.equal(expected[1], returned[1])
   
