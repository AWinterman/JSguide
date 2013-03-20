module.exports = Registrar

function Registrar(){
    this._associative_map = {};
}

var proto = Registrar.prototype;


//this is cool, `_associative_map` is defined once per instance of Registrar,
//but these methods are only defined in Registrar's prototype object.

proto.get = function(key){
    if (key in this._associative_map){
        return this._associative_map[key];
    }
    else {
        return [];
    }
}

proto.on = function(event, listener){
    if (undefined === this._associative_map[event]){
        //If we haven't seen it, make it
        this._associative_map[event] = [] 
    }
    //add the listener to the event listener
    this._associative_map[event].push(listener)
    return this
}


proto.emit = function(event){
    var funcs = this.get(event);
    for (var i = 0; i < funcs.length; i++){
        funcs[i].apply(this, [].slice.call(arguments, 1))
    }
    return this
}
