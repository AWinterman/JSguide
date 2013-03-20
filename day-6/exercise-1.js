module.exports = Acter

function Acter(setup){
    this.setup = setup
}

Acter.prototype.exclaim = function(action){
    return this.setup + action
}
