"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const DegreesToTurnTracker = require('./degreesToTurnTracker');
const AngleSensorTracker = require('./angleSensorTracker');
let io;
function init(Io) {
  io = Io;
  ping();
}
function sendInfo(nr, data) {
  let side = '';
  if (nr === 0) {
    side = 'LEFT'
  }
  if (nr === 1) {
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
  if (!socket) {
    socket = io;
  }
  socket.emit('map_lines', State.lines);
  sendMapCurrentLocation();
}
function sendMapABpoints(socket) {
  if (!socket) {
    socket = io;
  }
  const pointA = [State.pointA.location.longitude, State.pointA.location.latitude];
  const pointB = [State.pointB.location.longitude, State.pointB.location.latitude];

  socket.emit('map_ABpoints', { pointA, pointB, abLineBearing: State.abLineBearing });
}

function sendMapCurrentLocation() {
  const currentLocation = State.gps.currentLocation;
  io.emit('current_location', {
    currentLocation,
    leftLocation: State.gps.leftLocation,
    rightLocation: State.gps.rightLocation,
    driveBearing: State.driveBearing
  });
}

function ping() {
  let ping = false;
  setInterval(() => {
    ping = !ping;
    io.emit('pingt', ping);
  }, 250);
};

function sendABIsSetStatus(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('AB_IS_SET', {
    A: State.pointA.isSet,
    B: State.pointB.isSet,
  });
}

function sendAutosteerIsSet(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('AUTOSTEER_IS_SET', State.autoSteer);
}

function sendMachineWidth(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('machineWidth', DB.getSettings().machineWidth);
}
function sendLineOffset(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('lineOffset', DB.getSettings().lineOffset);
}
function SendNewUserData(socket) {
  sendABIsSetStatus(socket);
  sendAutosteerIsSet(socket);
  sendCrossTrackDistanceHistory(socket);
  sendSteeringHistory(socket);
  sendAngleSensorSettings(socket);
}

function sendSpeed(speed) {
  io.emit('currentSpeed', speed);
}

function sendCrossTrackDistance(data) {
  io.emit("crossTrackDistance", data);
}
function sendCurrentLineNumber(data) {
  io.emit('currentLineNumber', data);
}

function sendCrossTrackDistanceHistory(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('crossTrackDistanceHistory', CrossTrackDistanceTracker.getHistorys());
}
function sendSteeringHistory(socket){
  if (!socket) {
    socket = io;
  }
  socket.emit('steeringHistory', {steeringHistorys: AngleSensorTracker.getHistorys(), targetHistorys: DegreesToTurnTracker.getHistorys()})
}

function sendRawAngleSensor(data) {
  io.emit('rawAngleSensorValue', data);
}

function sendAngleSensorSettings(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('angleSensorSettings', DB.getSettings().steeringAngleSensor);
}
function sendangleSensorSaveSuccess(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('angleSensorSaveSuccess');
}
function sendMachineSettingsSaveSuccess(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('machineSettingsSaveSuccess');
}

function sendMachineSettings(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('machineSettings', DB.getSettings().machine)
}
function sendTargetPointSettings(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('targetPointSettings', DB.getSettings().targetPoint);
}
function sendTargetPointSettingsSaveSuccess(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('targetPointSettingsSaveSuccess');
}
function sendWheelAndTargetPointLocation(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('targetPointLocation',
    {
      targetPointLocation: [
        State.targetPointLocation.longitude,
        State.targetPointLocation.latitude
      ],
      wheelPosition: [
        State.wheelPosition.longitude,
        State.wheelPosition.latitude
      ]
    }
  )
}
function sendCurrentWheelAngle(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('currentSteeringAngle', { date: new Date(), value: State.currentWheelAngle });
}

function sendDegreesToTurn(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('targetSteeringAngle', { date: new Date(), value: State.degreesToTurn });
}

function sendSteeringSettings(socket){
  if (!socket) {
    socket = io;
  }
  let {method,  mode, pid, toleranceDegrees} = DB.getSteeringSettings();
  socket.emit('steeringSettings', {method, mode, pid, toleranceDegrees})
}

module.exports = {
  init,
  sendInfo,
  sendMapLines,
  sendMapCurrentLocation,
  sendABIsSetStatus,
  sendAutosteerIsSet,
  sendSpeed: sendSpeed,
  sendCrossTrackDistance,
  SendNewUserData,
  sendMachineWidth,
  sendLineOffset,
  sendCurrentLineNumber,
  sendMapABpoints,
  sendRawAngleSensor,
  sendAngleSensorSettings,
  sendangleSensorSaveSuccess,
  sendMachineSettings,
  sendMachineSettingsSaveSuccess,
  sendTargetPointSettings,
  sendTargetPointSettingsSaveSuccess,
  sendWheelAndTargetPointLocation,
  sendCurrentWheelAngle,
  sendDegreesToTurn,
  sendSteeringSettings
};