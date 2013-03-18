var request = require('request')

module.exports = function(url1, url2, url3, ready) {
  request.get(url1, function(err1, resp, firstHTML) {
    request.get(url2, function(err2, resp, secondHTML) {
      request.get(url3, function(err3, resp, thirdHTML) {
        if(err1 || err2 || err3) {
          return ready(err1 || err2 || err3)
        }
        return ready(null, {
          first: firstHTML
        , second: secondHTML
        , third: thirdHTML 
        })
      })
    })
  })
}
