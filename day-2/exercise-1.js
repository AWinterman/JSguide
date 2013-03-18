function guillotine(obj, val){
    Object.defineProperty(obj, 'beheadingOfRobespierre', {
        value: val
    })
}

module.exports = guillotine
