module.exports = give_speach

function give_speach(Constructor){
    New_type = function(){
        Constructor.call(this);
    }
    New_type.prototype = new Constructor;
    New_type.prototype.constructor = New_type;
    New_type.prototype.quoth = function(quotation){
        console.log(quotation);
    }
    return New_type
}
