const mongoose = require('mongoose');
const clientes = require('./models/clientes');
mongoose.connect("mongodb://localhost/RB2");
clientes.find({ $or: [ { "distribuye": true }, { "distribuye": false } ] },function(err,cli){
    for(i=0;i<=cli.length-1;i++){
            console.log(cli[i].ultima_visita)
            console.log(cli[i].vitacora[cli[i].vitacora.length-1].fecha)
            console.log("______________________")
            clientes.update({_id:cli[i]._id},{ultima_visita:cli[i].vitacora[cli[i].vitacora.length-1].fecha},function(){});
            for(j=0;j<=cli[i].vitacora.length-1;j++){
                if(cli[i].vitacora[j].GPS.length <= 0){
                    clientes.update({_id:cli[i]._id,"vitacora._id":cli[i].vitacora[j]._id},{"vitacora.$.GPS":[cli[i].GPS[0],cli[i].GPS[1],100]},function(){})
                }
            }
    }
})