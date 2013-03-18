var request = require('request');

module.exports = function(url1, url2, url3, ready){
    var error = false,
        loaded_counter = 0,
        htmls = {},
        names = "firstHTML secondHTML thirdHTML".split(" "),
        urls = [].slice.call(arguments, 0, -1);

    request.get(url1, get_firstURL);

    function get_firstURL(err, response1, firstHTML){
        htmls.first = firstHTML;
        error = err;
        request.get(url2, get_secondURL);
    }

    function get_secondURL(err, response2, secondHTML){
        htmls.second = secondHTML;
        error = error || err;
        request.get(url3, get_thirdURL)
    }

    function get_thirdURL(err, response3, thirdHTML){
        htmls.third = thirdHTML;
        error = error || err;
        if (error){
            return ready(error);
        }
        ready(null, htmls);

    }


}
