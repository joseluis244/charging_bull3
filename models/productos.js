var mongoose = require('mongoose');

var productosSchema = mongoose.Schema({
        nombre: String,
        display: String,
        tipo: String,
        precios: [Number]
},{collection : 'productos'});
module.exports = mongoose.model('productos', productosSchema);