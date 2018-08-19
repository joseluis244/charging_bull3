var productos = require('./models/productos');
var cli = require('./models/clientes');
var tipocli = require("./models/tiposclientes");
var materiales = require("./models/materiales");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/RB2")

var redbull=[]
var bebida1 =[]
var bebida2 =[]
var bebida3 =[]
var bebida4 =[]

cli.find({},function(err,cli){
    for(i=0;i<=cli.length-1;i++){
        if(cli[i].productos.length > 0){

            if(cli[i].productos[0].P_precio > 0){
                redbull.push(cli[i].productos[0].P_precio)
            }
            if(cli[i].productos[1].P_precio > 0){
                bebida1.push(cli[i].productos[1].P_precio)
            }
            if(cli[i].productos[2].P_precio > 0){
                bebida2.push(cli[i].productos[2].P_precio)
            }
            if(cli[i].productos[3].P_precio > 0){
                bebida3.push(cli[i].productos[3].P_precio)
            }
            if(cli[i].productos[4].P_precio > 0){
                bebida4.push(cli[i].productos[4].P_precio)
            }

        }
    }
})
setTimeout(function(){
    var n = redbull.length;
    var aux;
    while(n>=1){
        for(i=0;i<n;i++){
            if(redbull[i]>redbull[i+1]){
                aux = redbull[i+1];
                redbull[i+1] = redbull[i];
                redbull[i] = aux;
            }
        }
        n = n-1
    }
    var valor = redbull[0]
    var cantidad = 1;
    var valormax =  redbull[0] ;
    var cantidadmax = 0;
    for(i=1;i<=redbull.length-1;i++){
        if(redbull[i] == redbull[i-1]){
            cantidad = cantidad + 1;
        }
        else{
            if(cantidadmax < cantidad){
                cantidadmax = cantidad;
                valormax = valor;
            }
            valor = redbull[i];
            cantidad = 0;
        }
    }
    console.log(valormax);
    console.log(cantidadmax);
},3000)

