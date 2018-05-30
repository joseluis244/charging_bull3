var mongoose = require('mongoose');

var ClienteSchema = mongoose.Schema({
    //registro
        cli_id:String,
        nombre: String,
        direccion: String,
        GPS:[Number],
        tipo: String,
        contacto:[{C_nombre:String,
                    C_dato:String}],
    //ultimos datos
        distribuye:Boolean,
        distribuidor: String,
        comentario: String,
        materiales:[{N_material:String,
                    L_material:[String]}],
        productos:[{P_nombre:String,
                    P_precio:Number}],
        frio:Boolean,
        share:{redbull:Number,
                otro:Number},
        ciudad: String,
    //vitacora
        vitacora:[{fecha:Date,
                    usuario:String,
                    distribuye:Boolean,
                    distribuidor:String,
                    materiales:[{N_material:String,
                                L_material:[String]}],
                    productos:[{P_nombre:String,
                                P_precio:String}],
                    share:{redbull:String,
                            otro:String}}]
},{collection : 'clientes'});
module.exports = mongoose.model('clientes', ClienteSchema);