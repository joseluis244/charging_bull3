var mongoose = require('mongoose');

var TclientesSchema = mongoose.Schema({
        tipo: String
},{collection : 'tiposclientes'});
module.exports = mongoose.model('tiposclientes', TclientesSchema);