
var json2xls = require('json2xls');
const mongoose      = require("mongoose");
mongoose.connect("mongodb://localhost/RB2");
var cli = require('./models/clientes');
var fs = require("fs");



function crearxls(callback){
var xls = [];
cli.find({$or:[{distribuye:true},{distribuye:false}]},function(err,cli){
for(x=0;x<=cli.length-1;x++){
    var a = datoscli(cli[x]);
    var b = bebidas(cli[x].productos);
    var c = coolers(cli[x].materiales[0].L_material);
    var d = visibility(cli[x].materiales[1].L_material)
    var e = complementos(cli[x]);
    var f = a+b+c+d+e
    //var obj = JSON.parse('{"ID":"778","Nombre":"Tienda 1","Ciudad":"Santa Cruz","Direccion":"Ciudad jardin","Tipo":"Micromercado","Distribuye" : "Si","Distribiudor":"Dhotar","Red Bull":"16","Rush":"10","Ciclon 500ml":"11","Black":"8","Monster":"16","otro":"No","coolers":"","Propio":"No", "Baby Cooler":"Si", "Slim Cooler":"No", "Can Cooler":"Si", "Equipo de la competencia":"No", "Fast Lane Open":"No", "Small Open Front":"No", "Mega Glass Door":"No", "Slim Fast Lane":"Si", "Refuel Cooler":"Si","caras":"","red bull": "No","otros": "No","comentario" : ""}')
    var obj = JSON.parse(f);
    obj.comentario = cli[x].comentario;
    xls.push(obj);
}    
callback(xls);
});
}

function datoscli(cli){
    if(cli.distribuye == true){
        var dis = "Si"
    }
    else{
        var dis = "No"
    }
    return '{"ID":"'+cli.cli_id+'","Nombre":"'+cli.nombre+'","Ciudad":"'+cli.ciudad+'","Direccion":"'+cli.direccion+'","Tipo":"'+cli.tipo+'","Distribuye" : "'+dis+'","Distribiudor":"'+cli.distribuidor+'",'
}
function bebidas(bebidas){
    var precio = [];
    for(i=0;i<=bebidas.length-1;i++){
        if(bebidas[i].P_precio>0 && bebidas[i].P_precio != null){
            precio.push(bebidas[i].P_precio);
        }
        else{
            precio.push("No");
        }
    }
    var str = '"Red Bull":"'+precio[0]+'","Rush":"'+precio[1]+'","Ciclon 500ml":"'+precio[2]+'","Black":"'+precio[3]+'","Monster":"'+precio[4]+'","otro":"'+precio[5]+'",';
    //var str = `"Red Bull":"16","Rush":"15","Ciclon 500ml":"15","Black":"15","Monster":"15","otro":"15",`;
    return str;
}
function coolers(coop){
    var cooler = [];
    if(coop.length == 0){
        return '"coolers":"","Propio":"No", "Baby Cooler":"No", "Slim Cooler":"No", "Can Cooler":"No", "Equipo de la competencia":"No", "Fast Lane Open":"No", "Small Open Front":"No", "Mega Glass Door":"No", "Slim Fast Lane":"No", "Refuel Cooler":"No",';
    }
    var coolers = 'Propio,Baby Cooler,Slim Cooler,Can Cooler,Equipo de la competencia,Fast Lane Open,Small Open Front,Mega Glass Door,Slim Fast Lane,Refuel Cooler'.split(",");
    for(i=0;i<=coolers.length-1;i++){
        for(j=0;j<=coop.length-1;j++){
            if(coolers[i]==coop[j]){
                cooler.push("Si");
                break;
            }
            else{
                if(j == coop.length-1){
                    cooler.push("No");
                }
            }
        }
    }
    return '"coolers":"","Propio":"'+cooler[0]+'", "Baby Cooler":"'+cooler[1]+'", "Slim Cooler":"'+cooler[2]+'", "Can Cooler":"'+cooler[3]+'", "Equipo de la competencia":"'+cooler[4]+'", "Fast Lane Open":"'+cooler[5]+'", "Small Open Front":"'+cooler[6]+'", "Mega Glass Door":"'+cooler[7]+'", "Slim Fast Lane":"'+cooler[8]+'", "Refuel Cooler":"'+cooler[9]+'",';
}
function visibility(visbi){
    if(visbi.length == 0){
        return '"visibility":"","Colgante":"No", "Sticker de lata":"No", "Marca Precio":"No", "Cartoon":"No", "Lata Aluminio":"No", "Sticky shlef":"No", "Carrileras":"No", "Two Cans":"No", "Parasite SC":"No","Parasite 4Pack":"No", "Dispensador Lata":"No", "Rack":"No",';
    }
    var visib = [];
    var visi = 'Colgante,Sticker de lata,Marca Precio,Cartoon,Lata Aluminio,Sticky shlef,Carrileras,Two Cans,Parasite SC,Parasite 4Pack,Dispensador Lata,Rack'.split(",");
    
    for(i=0;i<=visi.length-1;i++){
        for(j=0;j<=visbi.length-1;j++){
            if(visi[i]==visbi[j]){
                visib.push("Si");
                break;
            }
            else{
                if(j == visbi.length-1){
                    visib.push("No");
                }
            }
        }
    }
    return '"visibility":"","Colgante":"'+visib[0]+'", "Sticker de lata":"'+visib[1]+'", "Marca Precio":"'+visib[2]+'", "Cartoon":"'+visib[3]+'", "Lata Aluminio":"'+visib[4]+'", "Sticky shlef":"'+visib[5]+'", "Carrileras":"'+visib[6]+'", "Two Cans":"'+visib[7]+'", "Parasite SC":"'+visib[8]+'","Parasite 4Pack":"'+visib[9]+'", "Dispensador Lata":"'+visib[10]+'", "Rack":"'+visib[11]+'",';
}
function complementos(cli){
    if(cli.share.redbull == null || cli.share.otro == null){
        var r = "No";
        var o = "No";
    }
    else{
        var r = cli.share.redbull;
        var o = cli.share.otro;
    }
    return '"caras":"","red bull": "'+r+'","otros": "'+o+'","comentario" : ""}';
}
module.exports.crearxls = crearxls;