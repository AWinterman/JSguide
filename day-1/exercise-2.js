var memoizer;

memoizer = function(a, b){
    if (memoizer.cache === undefined){
        memoizer.cache = {}
    }
    if (a in memoizer.cache){
        return memoizer.cache[a];
    }
    else {
        var to_return =  b();
        memoizer.cache[a] = to_return;
        return to_return
    }
    
}

module.exports = memoizer
