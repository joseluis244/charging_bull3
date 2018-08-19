//const mongoose      = require("mongoose");
//mongoose.connect("mongodb://localhost/RB2");
var productos = require('./models/productos');
var cli = require('./models/clientes');
var tipocli = require("./models/tiposclientes");
var materiales = require("./models/materiales");
var math = require("mathjs");


/*materialess(function(dato){
    console.log(dato);
})*/


function promedios(callback){
    var cantidad = [];
    var precios = [];
    cli.find({distribuye:true},function(err,cli) {
        productos.find({},function(err,prd){
            for(i=0;i<=prd.length-1;i++){
                cantidad.push(0);
                precios.push(0);
            }
            for(i=0;i<=cli.length-1;i++){
                for(j=0;j<=cli[i].productos.length-1;j++){
                    var PP = cli[i].productos[j].P_precio;
                    if(PP <= 0 || cli[i].productos[j].P_precio == null){}
                    else{
                        for(k=0;k<=prd.length-1;k++){
                            var CP = cli[i].productos[j].P_nombre;
                            if( CP == prd[k].nombre){
                                precios[k] += PP;
                                cantidad[k] ++;
                                break;
                            }
                        }                
                    }

                }
            }
            //aqui finaliza analicis
            var promedios = {nombre:[],precio:[],cantidad:[]}
            for(i=0;i<=prd.length-1;i++){
                promedios.nombre.push(prd[i].nombre);
                var Vprom = precios[i]/cantidad[i];
                promedios.precio.push(Vprom.toFixed(2));
                promedios.cantidad.push(cantidad[i]);
            }
            callback(promedios);  
        })
    })
}

function moda(callback){
    cli.find({ $or: [{ "distribuye": true }, { "distribuye": false }] }, { "productos": 1, "_id": 0 }, function (err, cli) {
        var redbull = []
        var rush = []
        var ciclon = []
        var black = []
        var monster = []
        var cantidad = [0,0,0,0,0]
        var modas = []
        var resultado = {}
        for (i = 0; i <= cli.length - 1; i++) {
            if (cli[i].productos[0].P_precio > 0) {
                redbull.push(cli[i].productos[0].P_precio);
                cantidad[0]++;
            }
            if (cli[i].productos[1].P_precio > 0) {
                rush.push(cli[i].productos[1].P_precio);
                cantidad[1]++;
            }
            if (cli[i].productos[2].P_precio > 0) {
                ciclon.push(cli[i].productos[2].P_precio);
                cantidad[2]++;
            }
            if (cli[i].productos[3].P_precio > 0) {
                black.push(cli[i].productos[3].P_precio);
                cantidad[3]++;
            }
            if (cli[i].productos[4].P_precio > 0) {
                monster.push(cli[i].productos[4].P_precio);
                cantidad[4]++;
            }
        }
        modas = [math.mode(redbull)[0], math.mode(rush)[0], math.mode(ciclon)[0], math.mode(black)[0], math.mode(monster)[0]]
        resultado.moda = modas;
        resultado.cantidad = cantidad;
        callback(resultado);
    })
}



function cantidades(callback){
    cli.count({},function(err,cliT) {
        cli.find({distribuye:true},function(err,cliV){
            var redbullC = 0;
            for(i=0;i<=cliV.length-1;i++){
                if(cliV[i].productos[0].P_precio > 0){
                    redbullC ++;
                }
            }
            var obj = {total:cliT,vende:cliV.length,RB:redbullC};
            callback(obj);
        });       
    });
}
function clientes(callback){
    var tipos=[];
    var cantidades = [];
    cli.find({distribuye:true},function(err,cli){
        tipocli.find({},function(err,TC){
            for(i=0;i<=TC.length-1;i++){
                tipos.push(TC[i].tipo);
                cantidades.push(0);
            }
            for(i=0;i<=cli.length-1;i++){
                if(cli[i].productos[0].P_precio > 0){
                    for(j=0;j<=tipos.length-1;j++){
                        if(cli[i].tipo == tipos[j]){
                            cantidades[j]++;
                            break;
                        }
                    }
                }
            };
            var tipoCL ={nombres:tipos,cantidades:cantidades} 
            callback(tipoCL)
        });
    });
}
function materialess(callback){
    cli.find({$or:[{distribuye:true},{distribuye:false}]},function(err,cli){
        materiales.find({},function(err,mat){
            var Ncooler=[];
            var Nvisi=[];
            var Ccooler =[];
            var Cvisi=[];
            for(i=0;i<=mat[0].lista.length-1;i++){
                Ncooler.push(mat[0].lista[i]);
                Ccooler.push(0);
            }
            for(i=0;i<=mat[1].lista.length-1;i++){
                Nvisi.push(mat[1].lista[i]);
                Cvisi.push(0);
            }
            for(i=0;i<=cli.length-1;i++){
                for(j=0;j<=cli[i].materiales[0].L_material.length-1;j++){
                    for(k=0;k<=Ncooler.length-1;k++){
                        if(cli[i].materiales[0].L_material[j] == Ncooler[k]){
                            Ccooler[k]++;
                            break;
                        }
                    }
                }
                for(j=0;j<=cli[i].materiales[1].L_material.length-1;j++){
                    for(k=0;k<=Nvisi.length-1;k++){
                        if(cli[i].materiales[1].L_material[j] == Nvisi[k]){
                            Cvisi[k]++;
                        }
                    }
                }
            }
            var obj ={NC:Ncooler,CC:Ccooler,NV:Nvisi,CV:Cvisi};
            callback(obj)
        })
    })
}

module.exports.promedios = promedios;
module.exports.moda = moda;
module.exports.cantidades = cantidades;
module.exports.clientes = clientes;
module.exports.materialess = materialess;