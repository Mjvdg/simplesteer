"use strict";
const Config = require('../config');
const io = require('socket.io')();
const State = require('./state');
const IoSend = require('./socketIO-send');
const createAndSendLines = require('./lines').createAndSend;
const DB = require('./db/Repo');
const PidController = require('./pidController');
const ArduinoApi = require('./ArduinoApi');
IoSend.init(io);


io.on('connection', (socket) => {
  if (Config.debug) {
    console.log(`Socket users: ${io.engine.clientsCount}`);
  }

  IoSend.SendNewUserData(socket);

  socket.on('mapIsReady', () => {
    if (State.pointA.isSet && State.pointB.isSet) {
      IoSend.sendMapABpoints(socket);
      IoSend.sendMapLines(socket);
    }
  });
  socket.on('setA', () => {
    State.pointA.here();
    IoSend.sendMapABpoints();
    State.pointB.isSet && createAndSendLines();
    IoSend.sendABIsSetStatus();
    console.log("setA");
  });
  socket.on('setB', () => {
    State.pointB.here();
    IoSend.sendMapABpoints();
    State.pointA.isSet && createAndSendLines();
    IoSend.sendABIsSetStatus();
    console.log("setB");
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
    if (Config.debug) {
      console.log(`Socket users: ${io.engine.clientsCount}`);
    }
  });
  socket.on('machineWidth', (data) => {
    DB.setMachineWidth(data);
    if (State.pointA.isSet && State.pointB.isSet) {
      createAndSendLines();
    }
  });
  socket.on('lineOffset', (data) => {
    DB.setLineOffset(data);
    if (State.pointA.isSet && State.pointB.isSet) {
      createAndSendLines();
    }
  });
  socket.on('isAutosteerEnabled', (data) => {
    State.autoSteer = data;
    IoSend.sendAutosteerIsSet();
    PidController.reset();
    if(!data){
      ArduinoApi.turnStop();
    }
  });

  socket.on('getSVGData', () => {
    if (State.xyLines.length > 0) {
      IoSend.sendMapLines(socket);
    }
  });
  socket.on('getMachineWidth', () => {
    IoSend.sendMachineWidth();
  });
  socket.on('getLineOffset', () => {
    IoSend.sendLineOffset();
  });
  socket.on('log', (data) => {
    console.log(data);
  });
  socket.on('saveAngleSensorSettings', ({ maxLeft, straight, maxRight }) => {
    DB.setSteeringAngleSensor(maxLeft, straight, maxRight);
    IoSend.sendSaveSettingsSuccess(socket);
  });
  socket.on('saveMachineSettings', ({ antennaHeight, antennaToFrontAxleDistance, maxSteeringAngle }) => {
    DB.setMachineSettinges(antennaHeight, antennaToFrontAxleDistance, maxSteeringAngle);
    IoSend.sendSaveSettingsSuccess(socket);
  })
  socket.on('getAngleSensorSettings', () => {
    IoSend.sendAngleSensorSettings();
  });
  socket.on('getMachineSettings', () => {
    IoSend.sendMachineSettings();
  });
  socket.on('saveTargetPointSettings', ({ timeAheadSeconds, minimumDistance }) => {
    DB.setTargetPointSettings(timeAheadSeconds, minimumDistance);
    IoSend.sendSaveSettingsSuccess(socket);
  });
  socket.on('getTargetPointSettings', () => {
    IoSend.sendTargetPointSettings(socket);
  });
  socket.on('saveSteeringSettings', ({ method, mode, pid, toleranceDegrees, minimumMotorPwm }) => {
    DB.setSteeringSettings(method, mode, pid, toleranceDegrees, minimumMotorPwm);
    IoSend.sendSaveSettingsSuccess(socket);
  });
  socket.on('getSteeringSettings', () => {
    IoSend.sendSteeringSettings(socket);
  });
  socket.on('saveNtripSettings', ({host, username, password, mountpoint, port}) => {    
    DB.setNtripSettings(host, username, password, mountpoint, port);
    IoSend.sendSaveSettingsSuccess(socket);
  });
  socket.on('getNtripSettings', () => {
    IoSend.sendNtripSettings(socket);
  });  
});

io.listen(Config.socketIoPort);

if (Config.debug) {
  console.log(`Listening to port ${Config.socketIoPort}`);
}