module.exports = get_filey;

var fs = require('fs')

function get_filey(files, callback){
    var file_contents = [],
        f = 0,
        len = files.length;
    file_contents.length = len; 

    function process(err, data){
        if (err) throw err;
        file_contents.push(data)
    }

    for (f = 0; f<len; f++){
        fs.readFile(files[f], process, 'utf8')
    }
}
