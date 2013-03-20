module.exports = Discerning_emmiter;
//an emmitter that can remove events and emit once if it wants. Because some
//events just aren't right for it.

var Emitter = require("./exercise-2");

function Discerning_emmiter(){
    Emitter.call(this);
}

var cons = Discerning_emmiter
    //Setting up cons's inheritance
    , proto = cons.prototype = new Emitter
    proto.constructor = cons


proto.remove = function(event, functn){
    //remove the first occurence of function in the right array.
    var f_idx = this.get(event).indexOf(functn);
    if (f_idx < 0){
        return;
    }
    //set the matching function to undefined 
    this._associative_map[event][f_idx] = undefined;
    //and update _associate_map to exclude any undefined elements
     this._associative_map[event] = this._associative_map[event].filter(function(x){
         return x !== undefined
    })
}

proto.once = function(event, listener){
    function firework_listener(){
        //somehow I need access to listener's arguments
        listener.apply(this, arguments);
        //now removes itthis from the event que.
        this.remove(event, firework_listener);
    }

    this.on(event, firework_listener);
    return this;
}




