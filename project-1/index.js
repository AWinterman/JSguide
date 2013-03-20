module.exports = function(template){
    var tagged_al_num = /\{\{\s*(\w+)\s*\}\}/g;
    return function(obj, remaining){
        return  template.replace(tagged_al_num, function(match, name){
            return obj[name]
        })
    }
}
