const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/RB2");
var cli = require('../models/clientes');

function getgps(callback){
    cli.find({$or:[{distribuye:true},{distribuye:false}]},{_id:0,tipo:1,GPS:1}).sort({tipo:1}).exec(function(err,doc){
        callback(doc);
    })
}
module.exports.getgps = getgps;