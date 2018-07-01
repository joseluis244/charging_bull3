var date = new Date();
var date2 = date.toLocaleDateString("en-US").toString();
date2 = date2.split("/");
date2 = date2[2]+date2[1]+date2[0];
console.log(date2);
