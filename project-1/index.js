module.exports = function(template){
    return function(obj){
        //assuming the user isn't malicious, I'm just going to use all the
        //enumerables of the input object. 
        for (var tag in obj){
            var regex = new RegExp('\\{\\{\\s*'+ tag +'\\s*\\}\\}');
            template = template.replace(regex, obj[tag]);
        }
        return template
    }
}
