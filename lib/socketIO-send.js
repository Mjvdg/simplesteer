"use strict";
const State = require('./state');
const translate_coordinates = require('./latLonToXy');
const DB = require('./db/Repo');

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
function sendSVGdata(socket) {   
  if(!socket){
    socket = io;
  }
  const centerLocation = State.centerLocation;
  const pointA = State.pointA.location;
  const pointB = State.pointB.location;
  const xyPointA = translate_coordinates(pointA, centerLocation);
  const xyPointB = translate_coordinates(pointB, centerLocation);
  socket.emit('svg_data', {
    xyLines: State.xyLines,
    xyPointA: xyPointA,
    xyPointB: xyPointB,
  });
  sendSVGCurrentLocation();
}

function sendSVGCurrentLocation(){
  const currentLocation = State.gps.currentLocation;
  const xyCurrentLocation = translate_coordinates(currentLocation, State.centerLocation);
  io.emit('draw_vehicle', {xyCurr: xyCurrentLocation, driveBearing: State.driveBearing});   
}

function ping(){
  let ping = false;
  setInterval(() => {
      ping = !ping;
      io.emit('ping', ping);
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
}

function sendSpeed(speed){
  
}

function sendClosestLine(closestLine){
  io.emit('xyClosestLine', {
    A: translate_coordinates(closestLine.A, State.centerLocation),
    B: translate_coordinates(closestLine.B, State.centerLocation),
  });
}

function sendCrossTrackDistance(data){
  io.emit("crossTrackDistance", data);
}

function sendCrossTrackDistanceHistory(crossTrackDistance){

}

module.exports = { 
  init,
  sendInfo,
  sendSVGdata, 
  sendSVGCurrentLocation: sendSVGCurrentLocation, 
  sendABIsSetStatus: sendABIsSetStatus,
  sendAutosteerIsSet,
  sendSpeed,
  sendClosestLine,
  sendCrossTrackDistance,
  sendCrossTrackDistanceHistory,
  SendNewUserData,
  sendMachineWidth
};