"use strict";
require('./lib/ArduinoApi').open();
const RtkClient = require('./lib/RtkClient');
const State = require('./lib/state');
require('./lib/socketIO');
 
State.eventEmitters.steering.on('turnRight', function(){
  console.log('turnRight');
});

let rtkLeft = new RtkClient(0);
let rtkRight = new RtkClient(1);

