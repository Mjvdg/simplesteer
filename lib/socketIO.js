"use strict";
const Config = require('./config.js');
const io = require('socket.io')();
const State = require('./state');
const IoSend = require('./socketIO-send');
const createAndSendLines = require('./createLines2');
const DB = require('./db/Repo');
IoSend.init(io);


io.on('connection', (socket) => {
  if (Config.debug){
    console.log(`Socket users: ${io.engine.clientsCount}`);
  }

  IoSend.SendNewUserData(socket);

  socket.on('mapIsReady', () => {
    IoSend.sendMapLines(socket);
    IoSend.sendMapABpoints(socket);
  });
  socket.on('setA', () => {
    State.pointA.here();
    State.pointB.isSet && createAndSendLines();
    IoSend.sendABIsSetStatus();
    IoSend.sendMapABpoints();    
    console.log("setA");
  });
  socket.on('setB', () => {
    State.pointB.here();
    State.pointA.isSet && createAndSendLines();
    IoSend.sendABIsSetStatus();
    IoSend.sendMapABpoints();    
  });
  socket.on('turnStop', () => {
    State.eventEmitters.steering.emit('turnStop');
  });
  socket.on('turnRight', () => {
    State.eventEmitters.steering.emit('turnRight');
  });
  socket.on('turnLeft', () => {
    State.eventEmitters.steering.emit('turnLeft');
  });
  socket.on('disconnect', () => {
    if (Config.debug){
      console.log(`Socket users: ${io.engine.clientsCount}`);
    }
  });
  socket.on('machineWidth', (data) => {
    DB.setMachineWidth(Number(data));
    if(State.pointA.isSet && State.pointB.isSet){
      createAndSendLines();
    }
  });
  socket.on('isAutosteerEnabled', (data) => {
    State.autoSteer = data;
    IoSend.sendAutosteerIsSet();
  });
  
  socket.on('getSVGData',() =>{
    if( State.xyLines.length > 0 ){
      IoSend.sendMapLines(socket);
    }    
  });
  socket.on('getMachineWidth',() => {
    IoSend.sendMachineWidth();
  })
});

io.listen(Config.socketIoPort);
  
if (Config.debug){
  console.log(`Listening to port ${Config.socketIoPort}`);
}