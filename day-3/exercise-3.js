var request = require('request');

function get_urls(loaded_counter){
    //A function which simply updates htmls and error (as side effects) if
    //we have yet to exhaust the `urls`. Alternatively, `get_nth_url calls
    //ready (its last argument) on htmls or error (as appropriate).
    return function(err, response, html){
        //update the right html
        htmls[names[loaded_counter]] = html;
        console.log(html);
        error = err || error;
        loaded_counter += 1;
        if (loaded_counter === urls.length - 1){
            //then we've gotten through all the urls, and we should do all
            //those things that require us to have all of them already.
            if (error){
                return ready(error);
            }
            return ready(null, htmls);
        }
        request.get(urls[loaded_counter],  get_urls(loaded_counter));
    }
}


module.exports = function(url1, url2, url3, ready){
    var error = false,
        loaded_counter = 0,
        htmls = {},
        names = "firstHTML secondHTML thirdHTML".split(" "),
        urls = [].slice.call(arguments, 0, -1);

    request.get(url[urls[loaded_counter]], get_url(loaded_counter))
}

/*
\in FunctionDeclaration: ["request"]
  \in FunctionExpression: ["url1","url2","url3","ready","error","loaded_counter","htmls","urls","names","get_nth_url","u"]
    \in FunctionDeclaration: ["n"]
      \in FunctionExpression: ["err","resp","html"]
      /
    /
  /
/

AssertionError: your function's scope should look like
\
  \
    \
    /
    \
    /
    \
    /
  /
/
*/

// module.exports =  function(url1, url2, url3, ready) {
//   request.get(url1, function(err1, resp, firstHTML) {
//     request.get(url2, function(err2, resp, secondHTML) {
//       request.get(url3, function(err3, resp, thirdHTML) {
//         if(err1 || err2 || err3) {
//           return ready(err1 || err2 || err3)
//         }
//         return ready(null, {
//           first: firstHTML
//         , second: secondHTML
//         , third: thirdHTML 
//         })
//       })
//     })
//   })
// }
// 

