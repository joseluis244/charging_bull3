var tipo = require("./models/tiposclientes");
var cliente = require("./models/clientes");
var proveedores = require("./models/proveedores");
var productos = require("./models/productos");
var materiales =require("./models/materiales");
var dbs = require("./promedios");
var xls= require("./xlsx3");
var getgps= require("./cluster/gps");
var formidable = require('formidable');
var fs = require('fs')



module.exports = function(app, passport){
    //GET
    app.get("/",isLoggedIn,function(req,res){
        res.redirect("/main");
    });
    app.get("/main",isLoggedIn,function(req,res){
        res.render("main.ejs",{nombre:req.user.nombre,tipo:req.user.tipo});
    });
    app.get("/registrar",/*isLoggedIn,*/function(req,res){
        tipo.find({},function(err,tipos){
            res.render("registro2.ejs",{tipos:tipos})
        });
    });
    app.get("/encuesta",isLoggedIn,function(req,res){
        var clid = req.param("clid");
        getdata(clid,(datos,cliente)=>{
            res.render("encuesta.ejs",{nombrecli:cliente.cli_nombre,cli_id:cliente.cli_id,clitipo:cliente.tipo,distribuidores:datos.prov,bebida:datos.prod,cooler:datos.mat[0].lista,visibility:datos.mat[1].lista})
        })
    });
    app.get("/corregir",/*isLoggedIn,*/function(req,res){
        cliente.findById(req.param("cli"),function(err,cli){
            res.render("registro2correccion.ejs",{cli:cli});
            //console.log(cli)   
        })
    });
    app.get("/corregire",/*isLoggedIn,*/function(req,res){
        cliente.findById(req.param("cli"),function(err,cli){
            res.render("encuestacorregir.ejs",{cli:cli});
        })
    });
    app.get("/login",function(req,res){
        res.sendfile("./html/login.html");
    });
    app.get('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.redirect('/login');
    });
    app.get("/listas/:lista", function (req, res) {
        var lista = req.params.lista;
        if (req.user.ciudad == "Santa Cruz" || req.user.ciudad == "La Paz") {
            cliente.find({ "ciudad": req.user.ciudad }, null, { limit: 100, sort: { _id: -1 } }, function (err, clientes) {
                res.render(lista + ".ejs", { cliente: clientes, tipo: req.user.tipo })
            });
        }
        else {
            cliente.find({}, null, { limit: 100, sort: { _id: -1 } }, function (err, clientes) {
                res.render(lista + ".ejs", { cliente: clientes, tipo: req.user.tipo })
            });
        }
    });
    app.get("/region", function (req, res) {
        //var lista = req.params.lista;
        if (req.user.ciudad == "Santa Cruz" || req.user.ciudad == "La Paz") {
            cliente.find({"ciudad": req.user.ciudad}, null, { sort: { _id: -1 } }, function (err, clientes) {
                res.render("listacli.ejs", { cliente: clientes, tipo: req.user.tipo })
            });
        }
        else{
            res.send("Error de Usuario")
        }
    });
    app.get("/listastodo",function(req,res){
        //var lista = req.params.lista;
        cliente.find({},null,{sort:{_id:-1}},function(err,clientes){
            res.render("listacli.ejs",{cliente:clientes,tipo:req.user.tipo})
        });
    });
    app.get("/datos/:datos/:id",function(req,res){
        var datos = req.params.datos;
        var id = req.params.id;
        switch(datos){
            case "vitacoracli":
                cliente.findById(id,function(err,cliente){
                    res.render("vitacoracli.ejs",{fecha:cliente.vitacora,GPS:cliente.GPS});
                })
                break;
            case "datoscli":
                cliente.findById(id,function(err,cliente){
                    if(cliente.materiales.length == 0){
                        res.render("datoscli.ejs",{
                            distribuye:cliente.distribuye,
                            distribuidor:cliente.distribuidor,
                            frio:cliente.frio,
                            visibility:[],
                            cooler:[],
                            productos:cliente.productos,
                            share:cliente.share
                        });
                    }
                    else{
                        res.render("datoscli.ejs",{
                            distribuye:cliente.distribuye,
                            distribuidor:cliente.distribuidor,
                            frio:cliente.frio,
                            visibility:cliente.materiales[1].L_material,
                            cooler:cliente.materiales[0].L_material,
                            productos:cliente.productos,
                            share:cliente.share
                        });
                    }
                })
                break;
        }
    });
    app.get("/cliente",function(req,res){
        var id = req.param("cli");
        cliente.findById(id,function(err,cliente){
            res.render("cliente2.ejs",{
                clid:cliente._id,
                nombre:cliente.nombre,
                id_cli:cliente.cli_id,
                dir_cli:cliente.direccion,
                tipo_cli:cliente.tipo,
                Cnombre:cliente.contacto[0].C_nombre,
                Ctelefono:cliente.contacto[0].C_dato,
                GPS:cliente.GPS
            });
        });
    });
    app.get("/dash",function(req,res){
        dbs.moda(function(prom){
            dbs.cantidades(function(cant){
                dbs.clientes(function(Tcli){
                    dbs.materialess(function(materiales){
                        var obj = {total:cant.total,vende:cant.vende,RB:prom.cantidad[0]};
                        var Bnom = ["Red Bull","Rush", "Ciclon 500ml", "Black", "Moster"];
                        var Bprecios = prom.moda;
                        var Bcant = prom.cantidad;
                        res.render("dash.ejs",{cantidad:obj,bebidas:Bnom,Bprecio:Bprecios,Bcant:Bcant,Tcli:Tcli,materiales:materiales});
                    })
                })
            });

        })
    });
    app.get("/downloadxls",function(req,res){
        xls.crearxls(function(xls){
            var date = new Date();
            var date2 = date.toLocaleDateString("en-US").toString();
            date2 = date2.split("/");
            date2 = date2[2]+date2[1]+date2[0];
            res.xls(date2+".xlsx",xls);
        });
    });
    app.get("/mapagral",isLoggedIn,function(req,res){
        getgps.getgps(function(cli){
            res.render("mapcluster.ejs",{cli:cli});
        })
    })
    app.get("/galeria",function(req,res){
        cliente.find({ "fotos": { $exists: true } },{},{sort:{"ciudad": -1}},function(err,CLI){
            //console.log(CLI)        
            res.render("galeria.ejs",{cli2:CLI})
        })
    })
    app.get("/vergaleria",function(req,res){
        console.log(req.param("clid"))
        cliente.findById(req.param("clid"),{nombre:1,fotos:1},function(err,CLI){
            console.log(CLI);
            res.render("galeriaver.ejs",{nombre:CLI.nombre,fotos:CLI.fotos})
        })
    })
    app.get("/uploads/*",function(req,res){
        res.sendfile("uploads/"+req.params[0])
    })
    //POST
    app.post('/api/photo',function(req,res){
        var form = new formidable.IncomingForm();
        form.uploadDir = 'uploads/';
        form.parse(req, function(err, fields, files) { 
            var extencion = files.userPhoto.name.split('.')[files.userPhoto.name.split('.').length-1];
            var file_name = files.userPhoto.path.split('/')[1]+'.'+extencion;
            fs.rename(files.userPhoto.path,files.userPhoto.path+'.'+extencion,function(err){});
            res.redirect("/");
            var imagen = {
                fecha: Date(),
                nombre: file_name
            }
            //console.log(fields.id2)
            cliente.update({_id:fields.id2},{$push:{fotos:imagen}},function(){});
        });
    });
    app.post("/corregir",function(req,res){
        registro={
            cli_id:req.body.id,
            nombre:req.body.nombre,
            ciudad:req.body.ciudad,
            direccion:req.body.direccion,
            tipo:req.body.tipo,
            contacto:[{
                C_nombre:req.body.contacto_N,
                C_dato:req.body.contacto_D
            }]
        }
        //console.log(registro)
        cliente.update({_id:req.body.IDd},{$set:registro},function(){});
        res.send(true);
    });

    app.post("/corregire",function(req,res){
        var data = JSON.parse(req.body.datos)
        registro={
            distribuye:data.vende,
            distribuidor:data.distribuidor,
            materiales:data.mariales,
            share:data.caras,
            comentario:data.comen
        }
        //console.log(registro)
        cliente.update({_id:data.clid},{$set:registro},function(){});
        res.send(true);
    });

    app.post("/encuesta",function(req,res){
        var data = JSON.parse(req.body.datos);
        cliente.update({_id:data.clid},{
            distribuye:data.vende,
            distribuidor:data.distribuidor,
            materiales:data.mariales,
            productos:data.bebidas,
            frio:data.frio,
            share:data.caras,
            comentario:data.comen,
            ultima_visita:data.fecha
        },function(){});

        cliente.update({_id:data.clid},{$push:{vitacora:{
                    GPS:data.GPS,
                    fecha:data.fecha,
                    usuario:req.user.nombre,
                    distribuye:data.vende,
                    distribuidor:data.distribuidor,
                    materiales:data.mariales,
                    productos:data.bebidas,
                    share:data.caras,
                    comentario:data.comen
                    }
                }
            },function(){});


        res.send("asd");
    });
    app.post("/login",
        passport.authenticate('local', { 
            failureRedirect: '/login' 
        }),
        function(req, res) {
        res.redirect('/main');
        }
    );
    app.post("/registrar",function(req,res){
        var registro;
        registro={
            cli_id:req.body.id,
            nombre:req.body.nombre,
            ciudad:req.body.ciudad,
            direccion:req.body.direccion,
            GPS:[req.body.lat,req.body.lng],
            tipo:req.body.tipo,
            contacto:[{
                C_nombre:req.body.contacto_N,
                C_dato:req.body.contacto_D
            }]
        }
        var nuevocliente = new cliente(registro);
        nuevocliente.save();
        res.send("/");
    });
    app.post("/registrar2",function(req,res){
        var registro;
        registro={
            cli_id:req.body.id,
            nombre:req.body.nombre,
            ciudad:req.body.ciudad,
            direccion:req.body.direccion,
            GPS:[req.body.lat,req.body.lng],
            tipo:req.body.tipo,
            contacto:[{
                C_nombre:req.body.contacto_N,
                C_dato:req.body.contacto_D
            }]
        }
        var nuevocliente = new cliente(registro);
        nuevocliente.save();
        res.send("/encuesta?clid="+nuevocliente._id);
    });
    //funciones
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect('/login');
    };
    function getdata(clid,callback){
        var obj = {};
        cliente.findById(clid,function(err,cliente){
            obj.cli_id = cliente._id;
            obj.cli_nombre = cliente.nombre;
            obj.tipo = cliente.tipo;
            encuestadata(function(datos){
                callback(datos,obj);
            })
        });
    };
    function encuestadata(callback){
        var obj = {};
        proveedores.find({},"nombre",function(err,prov){
            obj.prov = prov;
            productos.find({},"nombre precios",function(err,prod){
                obj.prod = prod;
                materiales.find({},function(err,mat){
                    obj.mat = mat;
                    callback(obj);
                });
            });
        });
    };
}