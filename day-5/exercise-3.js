// COMMENT: I would rewrite this as follows:
// 
//    Given a function `g`, with arguments `arguments_g` and receiver `this_g`,
//    write a function, `f` such that
//   
//    `f.apply(this_g, arguments_g)` returns a variable-arity function, `h`, with
//    arguments `arguments_h`, and receiver `this_h`.
//   
//    `h` returns `g.apply(arguments_g, arguments_h)` 

//When I do f.apply(this_g, arguments_g), the receiver and arguments of f are
//replaced by the receiver and arguments of g
module.exports = function(self){
    var that = this;
    return function(){
        return that.apply(self, arguments);
    }
}
