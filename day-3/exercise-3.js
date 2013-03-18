var request = require('request');


module.exports = function(url1, url2, url3, ready){
    var error = false,
        loaded_counter = 0,
        htmls = {},

    request.get(url1, get_urls)
            
            
            
            function(err, resp, html1){
            error = err || error;
            htmls.firstHTML = html1;
            request.get(url2, )
    })

        
    }


        if (loaded_counter === urls.length - 1){
            //then we've gotten through all the urls, and we should do all
            //those things that require us to have all of them already.
            if (error){
                return ready(error);
            }
            return ready(null, htmls)
        }
        get_urls(n+1)
    }


    get_nth_url();
    //I'm getting an error because of how scoping is running.
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

