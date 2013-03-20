var fs = require('fs')

function garbage(buf) {
  for(var i = 0, len = buf.length; i < len; ++i) {
    buf[i] = ~~(Math.random() * 254)
  }
  return buf
}

module.exports = function(size, files) {
  var buf = new Buffer(size)
  for(var i = 0, len = files.length; i < len; ++i) {
    fs.writeFileSync(files[i], garbage(buf))
  }
  return files
}
