var json2xls = require('json2xls');
var fs = require('fs')
var json = {
    foo: 'bar',
    qux: 'moo',
    poo: 123
}
var fecha = new Date();
json.stux = fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear();
//export only the field 'poo'
var xls = json2xls(json);


fs.writeFileSync('data.xlsx', xls, 'binary');