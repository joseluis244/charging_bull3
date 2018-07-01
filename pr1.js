const cli = require("./models/clientes");
const mongoose = require("mongoose");
const express =  require("express");
const app = express();

app.set("view engine","ejs");
 mongoose.connect("mongodb://127.0.0.1/RB2");

app.get("/",function(req,res){

    cli.find({ $or: [ { "distribuye": false }, { "distribuye": false } ] },function(err,cli){

        res.render("listacli.ejs",{cliente:cli})
    })


})

app.listen(3000)