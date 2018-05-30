var mongoose = require('mongoose');

var proveedoresSchema = mongoose.Schema({
        nombre: String,
        display: String
},{collection : 'proveedores'});
module.exports = mongoose.model('proveedores', proveedoresSchema);