var keys = ['gary', 'human', 'hat']
  , vals = ['busey', 'being', 'town']
  , expected = {gary: 'busey', human: 'being', hat: 'town'}


module.exports = function(keys, vals){
    var zipped_obj = {},

    //get max length just in case.
        max_length = Math.max(keys.length, vals.length),
        i
    for (i = 0; i < max_length; ++i){
        zipped_obj[keys[i]] = vals[i];
    }
    return zipped_obj;
}

