var _token = "kacakacaANDkacakaca";
var wxv = require("wxverify");

exports.index = function(req, res){
    var result = wxv.verifyExpress(req, _token);
    if(false === result) {
        res.write("Invalid params.");
        res.end();
        return;
    }

    res.write(result);
    res.end();
    return;
};
