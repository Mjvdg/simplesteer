"use strict";
const fs = require('fs');
require('./lib/GpsReceivers').setup();
require('./lib/ArduinoApi').open();
require('./lib/socketIO');


 
// let c;
// let ser;
// try{
//     ser = fs.readFileSync("/sys/block/mmcblk0/device/cid", 'utf8');
//     c = fs.readFileSync("/proc/cpuinfo", 'utf8');
// }catch(e){
//     console.log(e);
//     process.exit(1);
// }
// if(c.indexOf("00000000748a62dc") === -1){
//     console.log(1);
//     process.exit(1);
// }
// if(ser!=="035344534333324780ba264b110139ad\n"){
//     console.log(2);
//     process.exit(1);
// }