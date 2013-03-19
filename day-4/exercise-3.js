module.exports = function(){
    //returns every odd indexed function as a list
    //list ==== array?
    o = [];
    for(var i=1; i < arguments.length; i = i+2){
        o.push(arguments[i]);
    }
    return o;
}
