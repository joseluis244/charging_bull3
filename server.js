const express       = require("express");
const passport      = require('passport');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const mongoose      = require("mongoose");
const fs            = require("fs");
//const favicon       = require('express-favicon');
const json2xls      = require('json2xls');
//http
const http          = require("http");
//const https         = require("https");
//const forcessl      = require("express-force-ssl");
//req internas
const rutas         = require("./rutas");
const passportconf  = require('./configuraciones/passport');
//const ssl           = require("./ssl");
//configuraciones
var configuraciones = JSON.parse(fs.readFileSync("./configuraciones/conf.json"));
//DB
mongoose.connect("mongodb://"+configuraciones.database.url+configuraciones.database.DB);
passportconf(passport);
//instancias
const app           = express();
//set app
app.set('view engine', 'ejs');
//use
//app.use(favicon("/img/redbull-icon.png"));
//app.use(forcessl);
//app.use(express.static("html"));
app.use("/cluster",express.static("cluster"));
//app.use("/node_modules",express.static("node_modules"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "medIT"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(json2xls.middleware);
//rutas
rutas(app,passport);
app.use((req,res,next)=>{res.status(404).sendfile("./html/404.html")})
//servidor
//https.createServer(ssl.ssl(),app).listen(configuraciones.http.https_puerto);
http.createServer(app).listen(configuraciones.http.http_puerto);
console.log("servidor iniciado");