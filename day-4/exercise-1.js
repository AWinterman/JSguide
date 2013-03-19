
module.exports = function(func){
    //I really thought this had to be done for any variable in func's scope at
    //first :) 
    global.gary_busey = 0;
    func()
}



