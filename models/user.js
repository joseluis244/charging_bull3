var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
        username: String,
        password: String,
        nombre: String,
        tipo: String,
        permiso: String,
        estado: Number
},{collection : 'users'});
module.exports = mongoose.model('User', userSchema);