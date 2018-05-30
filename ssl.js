const fs = require("fs");
var key = fs.readFileSync("./ssl/server.key");
var cert = fs.readFileSync("./ssl/server.crt");
var ca = fs.readFileSync("./ssl/ca.crt");
var opciones = {
    key:key,
    cert:cert,
    ca:ca
};
exports.ssl = function (){
    return opciones;
};