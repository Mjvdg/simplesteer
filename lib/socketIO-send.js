"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');

let io;
function init(Io){
  io = Io;
  ping();
}
function sendInfo(nr, data){
  let side = '';
  if(nr===0){
    side = 'LEFT'
  }
  if(nr===1){
    side = 'RIGHT'
  }

  io.emit(`INFO_${side}`, 
  {
    time: `${data.dateTime.getHours()}:${data.dateTime.getMinutes()}:${data.dateTime.getSeconds()}:${data.dateTime.getMilliseconds()}`,
    satCount: data.satCount,
    quality: data.quality,
  }
);
}
function sendMapLines(socket) {   
  if(!socket){
    socket = io;
  }  
  socket.emit('map_lines', State.lines );
  sendMapCurrentLocation();
}
function sendMapABpoints(socket){
  if(!socket){
    socket = io;
  }  
  const pointA = [State.pointA.location.longitude, State.pointA.location.latitude];
  const pointB = [State.pointB.location.longitude, State.pointB.location.latitude];

  socket.emit('map_ABpoints', {pointA, pointB});
}

function sendMapCurrentLocation(){
  const currentLocation = State.gps.currentLocation;
  io.emit('current_location', {
    currentLocation, 
    leftLocation: State.gps.leftLocation,
    rightLocation:State.gps.rightLocation,
    driveBearing: State.driveBearing
  });
}

function ping(){
  let ping = false;
  setInterval(() => {
      ping = !ping;
      io.emit('pingt', ping);
  }, 250);
};

function sendABIsSetStatus(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('AB_IS_SET', {
    A: State.pointA.isSet,
    B: State.pointB.isSet,
  });
}

function sendAutosteerIsSet(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('AUTOSTEER_IS_SET', State.autoSteer);
}

function sendMachineWidth(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('machineWidth', DB.getSettings().machineWidth);
}
function SendNewUserData(socket){
  sendABIsSetStatus(socket);
  sendAutosteerIsSet(socket);
  sendCrossTrackDistanceHistory(socket);
  sendAngleSensorSettings(socket);
}

function sendSpeed(speed){
  io.emit('currentSpeed', speed);
}

function sendCrossTrackDistance(data){
  io.emit("crossTrackDistance", data);
}
function sendCurrentLineNumber(data){
  io.emit('currentLineNumber', data);
}

function sendCrossTrackDistanceHistory(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('crossTrackDistanceHistory', CrossTrackDistanceTracker.getHistory());
}

function sendRawAngleSensor(data){
  io.emit('rawAngleSensorValue', data);
}

function sendAngleSensorSettings(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('angleSensorSettings', DB.getSettings().steeringAngleSensor);
}
function sendangleSensorSaveSuccess(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('angleSensorSaveSuccess');
}
function sendMachineSettingsSaveSuccess(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('machineSettingsSaveSuccess');
}
function sendMachineSettings(socket){
  if(!socket){
    socket = io;
  }
  socket.emit('machineSettings', DB.getSettings().machine)
}
module.exports = { 
  init,
  sendInfo,
  sendMapLines, 
  sendMapCurrentLocation, 
  sendABIsSetStatus,
  sendAutosteerIsSet,
  sendSpeed,
  sendCrossTrackDistance,
  SendNewUserData,
  sendMachineWidth,
  sendCurrentLineNumber,
  sendMapABpoints,
  sendRawAngleSensor,
  sendAngleSensorSettings,
  sendangleSensorSaveSuccess,
  sendMachineSettings,
  sendMachineSettingsSaveSuccess
};