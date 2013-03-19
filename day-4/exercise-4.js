module.exports = function(a_value){
    var that = this;
    return function(){
        for (var a = 0; a < arguments.length; ++a){
            that[arguments[a]] = a_value;
        }
    }
}
