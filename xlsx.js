const mongoose      = require("mongoose");
mongoose.connect("mongodb://localhost/RB2");
var cli = require('./models/clientes');
var mat = require('./models/materiales');
var json2xls = require('json2xls');

/*crearxls((data)=>{
    console.log(data);
})*/

function crearxls(callback){
    var xls = [];
    mat.find({},function(err,mat){
        cli.find({$or:[{distribuye:true},{distribuye:false}]},function(err,cli){
            for(x=0;x<=cli.length-1;x++){
                var str = datos(cli[x]);
                str = str +'"Coolers":"",' + coolers(cli[x].materiales[0].L_material,mat[0].lista);
                str = str +'"Visibility":"",' +visi(cli[x].materiales[1].L_material,mat[1].lista);
                str = str + come(cli[x]);
                var obj = JSON.parse(str);
                obj.Comentarios = cli[x].comentario;
                xls.push(obj);    
            }
            callback(xls);
        });
    });
}
function datos(cli){
    return '{"ID":"'+cli.cli_id+'","Nombre":"'+cli.nombre+'","Ciudad":"'+cli.ciudad+'","Direccion":"'+cli.direccion+'","Tipo":"'+cli.tipo+'","Distribiudor":"'+cli.distribuidor+'","Precio_redBull":'+cli.productos[0].P_precio+',';
    //return '{"ID":"'+cli.cli_id+'","Nombre":"'+cli.nombre+'","Ciudad":"'+cli.ciudad+'","Direccion":"'+cli.direccion+'","Tipo":"'+cli.tipo+'","Distribuye" : true,"Distribiudor":"'+cli.distribuidor+'",'
};
function coolers(Lcool,cooler){
    var str ='';
    if(Lcool.length == 0){
        for(i=0;i<=cooler.length-1;i++){
            str = str + '"' + cooler[i] + '":' + '"no",';
        }
    }
    for(i=0;i<=cooler.length-1;i++){
        for(j=0;j<=Lcool.length-1;j++){
            if(cooler[i] == Lcool[j]){
                str = str + '"' + cooler[i] + '":' + '"si",';
                break;
            }
            else{
                if(j==Lcool.length-1){
                    str = str + '"' + cooler[i] + '":' + '"no",';
                }
            }
        }
    }
    return str;
};
function visi(vis,visi){
    var str ='';
    if(vis.length == 0){
        for(i=0;i<=visi.length-1;i++){
            str = str + '"' + visi[i] + '":' + '"no",';
        }
    }
    for(i=0;i<=visi.length-1;i++){
        for(j=0;j<=vis.length-1;j++){
            if(visi[i] == vis[j]){
                str = str + '"' + visi[i] + '":' + '"si",';
                break;
            }
            else{
                if(j==vis.length-1){
                    str = str + '"' + visi[i] + '":' + '"no",';
                }
            }
        }
    }
    return str;
};
function come(cli){
    return '"Comentarios":""}';
}; 
module.exports.crearxls = crearxls;