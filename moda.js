var cli = require('./models/clientes');
var math = require("mathjs");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/RB2")

cli.find({ $or: [{ "distribuye": true }, { "distribuye": false }] }, { "productos": 1, "_id": 0 }, function (err, cli) {
    var bebidas = {pre:[],cant:[]};
    var cantidad = [0,0,0,0,0]
    var modas = []
    var resultado = {}
    for (i = 0; i <= cli.length - 1; i++) {
        if (cli[i].productos[0].P_precio > 0) {
            bebidas[0].push(cli[i].productos[0].P_precio);
            cantidad[0]++;
        }
        if (cli[i].productos[1].P_precio > 0) {
            bebidas[1].push(cli[i].productos[1].P_precio);
            cantidad[1]++;
        }
        if (cli[i].productos[2].P_precio > 0) {
            bebidas[2].push(cli[i].productos[2].P_precio);
            cantidad[2]++;
        }
        if (cli[i].productos[3].P_precio > 0) {
            bebidas[3].push(cli[i].productos[3].P_precio);
            cantidad[3]++;
        }
        if (cli[i].productos[4].P_precio > 0) {
            bebidas[4].push(cli[i].productos[4].P_precio);
            cantidad[4]++;
        }
    }
    modas = [math.mode(redbull)[0], math.mode(rush)[0], math.mode(ciclon)[0], math.mode(black)[0], math.mode(monster)[0]]
    resultado.moda = modas;
    resultado.cantidad = cantidad;
    console.log(resultado)
})


