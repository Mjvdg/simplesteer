"use strict";
const Config = require('./config.js');
const io = require('socket.io')();
const State = require('./state');
const IoSend = require('./socketIO-send');
const CreateLines = require('./createLines')
IoSend.init(io);

io.on('connection', (socket) => {
  if (Config.debug){
    console.log(`Socket users: ${io.engine.clientsCount}`);
  }
  IoSend.sendState(socket);
  if( State.xyLines.length > 0 ){
    IoSend.sendSVGdata(socket);
  }    
  socket.on('setA', () => {
    State.pointA.here();
    State.pointB.isSet && CreateLines();
    IoSend.sendState();
  });
  socket.on('setB', () => {
    State.pointB.here();
    State.pointA.isSet && CreateLines();
    IoSend.sendState();
  });
  socket.on('turnStop', () => {
    State.eventEmitters.steering.emit('turnStop')
  });
  socket.on('turnRight', () => {
    State.eventEmitters.steering.emit('turnRight')
  });
  socket.on('turnLeft', () => {
    State.eventEmitters.steering.emit('turnLeft')
  });
  socket.on('disconnect', () => {
    console.log(`Socket users: ${io.engine.clientsCount}`);
  });
});

io.listen(Config.socketIoPort);
  
if (Config.debug){
  console.log(`Listening to port ${Config.socketIoPort}`);
}