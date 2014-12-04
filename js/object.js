if (typeof NS == 'undefined') { NS = {}; }
 
NS.myFunction = {
    //empty stuff array, filled during initialization
    stuff: [],
 
    init: function init() {
        this.stuff.push('Testing');
    },
    reset: function reset() {
        this.stuff = [];
    },
    //will add new functionality here later
append: function append(string1, string2) {
    return string1 + string2;
}
};
 
NS.myFunction.init();
