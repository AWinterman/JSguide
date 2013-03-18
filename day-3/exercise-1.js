function strongMagnet(haystack){
    return function(needle){
        return haystack.indexOf(needle);
    }
}

module.exports = strongMagnet;
