var mongoose = require('mongoose');

var materialesSchema = mongoose.Schema({
        nombre: String,
        lista:[String]
},{collection : 'materiales'});
module.exports = mongoose.model('materiales', materialesSchema);