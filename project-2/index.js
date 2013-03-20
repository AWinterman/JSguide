module.exports = dotpath


function dotpath(string){
    return function(obj){
        var path = string.split("."), 
            new_obj = obj,
            new_attr = path.shift,
            old_obj,
            last_attr; 

        while (path.length && !!new_obj){
            console.log(new_obj);
            old_obj = new_obj
            old_attr = new_attr

            new_attr = path.shift()
            
            new_obj = old_obj[new_attr]
            if (path.length === 0){
                return new_obj
            }
        }
    }
}
