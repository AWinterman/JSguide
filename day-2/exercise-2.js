var nil = Proxy.create({
    get: function(target, name){
        if(name === 'toString' || name === 'valueOf'){
            return function(){
                return '<nil object>'
            }
        }
        return nil
    }
    , set: function(target, name, value) {
        throw new Error('cannot modify grouchy object')
  }
});

module.exports = nil;
