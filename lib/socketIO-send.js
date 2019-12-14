"use strict";
const State = require('./state');
const DB = require('./db/Repo');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const DegreesToTurnTracker = require('./degreesToTurnTracker');
const AngleSensorTracker = require('./angleSensorTracker');
const CurvedLineRecorder = require('./curvedLineRecorder');
const WheelPosition = require('./wheelPosition');
const FieldSaver = require('./fieldSaver');

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
      time: data.time,
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

function sendMapCurvedLines(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('mapCurvedLines', State.curvedLines);
  sendMapCurrentLocation();
}
function sendMapABpoints(socket) {
  if (!socket) {
    socket = io;
  }
  const pointA = State.pointA.location;
  const pointB = State.pointB.location;

  socket.emit('map_ABpoints', { pointA, pointB });
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
  sendMode(socket);
  sendIsAutoSteerAllowed(socket);
  sendIsRecordingStatus(socket);
  //sendClearMap();
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
function sendSteeringHistory(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('steeringHistory', { steeringHistorys: AngleSensorTracker.getHistorys(), targetHistorys: DegreesToTurnTracker.getHistorys() })
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

function sendSaveSettingsSuccess(socket) {
  socket.emit("saveSettingsSuccess");
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
function sendTargetPointLocation(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('targetPointLocation', State.targetPointLocation)
}
function sendWheelPosition(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('wheelPosition', WheelPosition.get());
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
function sendCurrentSlope() {
  io.emit('currentSlope', State.currentSlope);
}
function sendSteeringSettings(socket) {
  if (!socket) {
    socket = io;
  }
  let { method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration } = DB.getSteeringSettings();
  socket.emit('steeringSettings', { method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration })
}
function sendNtripSettings(socket) {
  if (!socket) {
    socket = io;
  }

  let { host, username, password, mountpoint, port } = DB.getSettings().ntrip;
  socket.emit('ntripSettings', { host, username, password, mountpoint, port });
}

function sendCurrentRecordedCurvedAbLine() {
  io.emit('currentRecordedCurvedAbLine', CurvedLineRecorder.get());
}

function sendMode(socket) {
  if (!socket) {
    socket = io;
  }
  let mode = DB.getSettings().mode;
  socket.emit('MODE', mode);
}
function sendClearMap() {
  io.emit('clearMap');
}
function sendIsAutoSteerAllowed(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('isAutosteerAllowed', State.isAutosteerAllowed);
}

function sendIsRecordingStatus(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('isRecordingStatus', State.curvedLines.isRecording);
}

function sendFields(socket) {
  if (!socket) {
    socket = io;
  }
  socket.emit('fields', FieldSaver.getFieldHeaders())
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
  sendLineOffset,
  sendCurrentLineNumber,
  sendMapABpoints,
  sendRawAngleSensor,
  sendAngleSensorSettings,
  sendMachineSettings,
  sendTargetPointSettings,
  sendTargetPointLocation,
  sendWheelPosition,
  sendCurrentWheelAngle,
  sendDegreesToTurn,
  sendSteeringSettings,
  sendSaveSettingsSuccess,
  sendNtripSettings,
  sendCurrentSlope,
  sendCurrentRecordedCurvedAbLine,
  sendMode,
  sendClearMap,
  sendIsAutoSteerAllowed,
  sendMapCurvedLines,
  sendSteeringHistory,
  sendCrossTrackDistanceHistory,
  sendFields
};