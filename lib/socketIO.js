"use strict";
const Config = require('../config');
const io = require('socket.io')();
const State = require('./state');
const IoSend = require('./socketIO-send');
const createAndSendLines = require('./lines').createAndSend;
const DB = require('./db/Repo');
const PidController = require('./pidController');
const ArduinoApi = require('./ArduinoApi');
const extendCurvedLine = require('./extendCurvedLine');
const CurvedLineRecorder = require('./curvedLineRecorder');
const DegreesToTurnTracker = require('./degreesToTurnTracker');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const FieldSaver = require('./fieldSaver');
const WorkRecorder = require('./workRecorder');
const Enums = require('./enums');
//const GpsReceivers = require('./GpsReceivers');

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
    IoSend.sendMapCurvedLines(socket);
    IoSend.sendBigRecordedWorkPoints(socket);
    IoSend.sendCurrentRecordedCurvedAbLine(socket);
  });
  socket.on('setA', () => {
    State.pointA.here();
    IoSend.sendMapABpoints();
    if (DB.getSettings().mode === Enums.SteeringMode.straightABlines) {
      if (State.pointB.isSet) {
        createAndSendLines();
        State.isAutosteerAllowed = true;
      } else {
        State.isAutosteerAllowed = false;
      }
    }
    IoSend.sendIsAutoSteerAllowed();
    IoSend.sendABIsSetStatus();
  });
  socket.on('setB', () => {
    State.pointB.here();
    IoSend.sendMapABpoints();
    if (DB.getSettings().mode === Enums.SteeringMode.straightABlines) {
      if (State.pointA.isSet) {
        createAndSendLines();
        State.isAutosteerAllowed = true;
      } else {
        State.isAutosteerAllowed = false;
      }
    }
    IoSend.sendIsAutoSteerAllowed();
    IoSend.sendABIsSetStatus();
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
    if (State.curvedLines.abLine.length > 0) {
      createAndSendLines();
    }
  });
  socket.on('lineOffset', (data) => {
    DB.setLineOffset(data);
    if (State.pointA.isSet && State.pointB.isSet) {
      createAndSendLines();
    }
    if (State.curvedLines.abLine.length > 0) {
      createAndSendLines();
    }
  });
  socket.on('isAutosteerEnabled', (data) => {
    State.autoSteer = data;
    IoSend.sendAutosteerIsSet();
    PidController.reset();
    if (!data) {
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
    console.log('log: ', data);
  });
  socket.on('saveAngleSensorSettings', ({ maxLeft, straight, maxRight }) => {
    DB.setSteeringAngleSensor(maxLeft, straight, maxRight);
    IoSend.sendSaveSettingsSuccess(socket);
  });
  socket.on('saveMachineSettings', ({ antennaHeight, antennaToFrontAxleDistance, antennaToRearAxleDistance, maxSteeringAngle }) => {
    DB.setMachineSettinges(antennaHeight, antennaToFrontAxleDistance, antennaToRearAxleDistance, maxSteeringAngle);
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
  socket.on('saveSteeringSettings', ({ method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration }) => {
    DB.setSteeringSettings(method, pid, toleranceDegrees, minimumMotorPwm, minimumPulseDuration);
    IoSend.sendSaveSettingsSuccess(socket);
    PidController.reset();
  });
  socket.on('getSteeringSettings', () => {
    IoSend.sendSteeringSettings(socket);
  });
  socket.on('saveNtripSettings', ({ host, username, password, mountpoint, port }) => {
    DB.setNtripSettings(host, username, password, mountpoint, port);
    IoSend.sendSaveSettingsSuccess(socket);
    //GpsReceivers.ntripRestart();
  });
  socket.on('getNtripSettings', () => {
    IoSend.sendNtripSettings(socket);
  });
  socket.on('piRestart', () => {
    require('child_process').exec('sudo /sbin/reboot', function (msg) { console.log('piRestart', msg) });
  });
  socket.on('piPoweroff', () => {
    require('child_process').exec('sudo /sbin/poweroff', function (msg) { console.log('piPoweroff', msg) });
  });
  socket.on('turnLeftPwm', (pwm) => {
    ArduinoApi.setPwm(pwm);
    ArduinoApi.turnLeft();
  });
  socket.on('turnRightPwm', (pwm) => {
    ArduinoApi.setPwm(pwm);
    ArduinoApi.turnRight();
  });
  socket.on('turnStop', () => {
    ArduinoApi.turnStop();
  });
  socket.on('turnLeftMinimumPulseDuration', (minimumPulseDuration) => {
    ArduinoApi.setPulseDuration(minimumPulseDuration);
    ArduinoApi.pulseLeft();
  })
  socket.on('turnRightMinimumPulseDuration', (minimumPulseDuration) => {
    ArduinoApi.setPulseDuration(minimumPulseDuration);
    ArduinoApi.pulseRight();
  });
  socket.on('modeChanged', (mode) => {
    DB.setMode(mode);
    IoSend.sendMode();
    DegreesToTurnTracker.clear();
    CrossTrackDistanceTracker.clear();
    IoSend.sendSteeringHistory();
    IoSend.sendCrossTrackDistanceHistory();
    State.pointA.clear();
    State.pointB.clear();
    IoSend.sendABIsSetStatus();
    IoSend.sendClearMap();
    State.curvedLines.abLine = [];
    State.curvedLines.closestLine = [];
    State.curvedLines.others = [];
    State.isAutosteerAllowed = false;
    State.bigWorkPolygons = [];
    IoSend.sendIsAutoSteerAllowed();
  });
  socket.on('curvedIsRecording', (isRecording) => {
    State.curvedLines.isRecording = isRecording;
    if (isRecording) {
      IoSend.sendClearMap();
      DegreesToTurnTracker.clear();
      CrossTrackDistanceTracker.clear();
      IoSend.sendSteeringHistory();
      IoSend.sendCrossTrackDistanceHistory();
    }
    if (!isRecording && CurvedLineRecorder.get().length >= 2) {
      //State.curvedLines.curvedAbLine = extendCurvedLine(State.curvedLines.curvedAbLine);
      State.curvedLines.abLine = CurvedLineRecorder.get();
      CurvedLineRecorder.reset();
      IoSend.sendClearMap();
      createAndSendLines();
      State.isAutosteerAllowed = true;
    } else {
      State.isAutosteerAllowed = false;
    }
    IoSend.sendIsAutoSteerAllowed();
  });

  socket.on('saveField', (name) => {
    FieldSaver.saveCurrentField(name);
  });
  socket.on('getFields', () => {
    IoSend.sendFields(socket);
  });
  socket.on('openField', (id) => {
    let field = FieldSaver.getField(id);
    State.bigWorkPolygons = field.recordedWork;
    DegreesToTurnTracker.clear();
    CrossTrackDistanceTracker.clear();
    CurvedLineRecorder.reset();
    IoSend.sendSteeringHistory();
    IoSend.sendCrossTrackDistanceHistory();
    IoSend.sendBigRecordedWorkPoints();
    if (field.type === Enums.SteeringMode.straightABlines) {
      DB.setMode(Enums.SteeringMode.straightABlines);
      IoSend.sendMode();
      State.pointA.location = field.pointA;
      State.pointB.location = field.pointB;
      createAndSendLines();
      IoSend.sendClearMap();
      IoSend.sendMapABpoints();
      IoSend.sendABIsSetStatus();
    }
    if (field.type === Enums.SteeringMode.curvedLines) {
      DB.setMode(Enums.SteeringMode.curvedLines);
      IoSend.sendMode();
      State.curvedLines.abLine = field.abLine;

      IoSend.sendClearMap();
      createAndSendLines();
    }
    if (field.type === Enums.SteeringMode.path) {
      DB.setMode(Enums.SteeringMode.path);
      IoSend.sendMode();
      State.curvedLines.abLine = field.abLine;
      State.curvedLines.others = [];
      IoSend.sendClearMap();
      createAndSendLines();
    }
    createAndSendLines();
    IoSend.sendRecordedArea(socket);
    State.isAutosteerAllowed = true;
    IoSend.sendIsAutoSteerAllowed();
  });
  socket.on('deleteField', (id) => {
    FieldSaver.deleteField(id);
    IoSend.sendFields();
  });
  socket.on('workIsRecording', (isRecording) => {
    WorkRecorder.setIsRecording(isRecording);
  });
  socket.on('clearRecordedWork', () => {
    State.bigWorkPolygons = [];
    IoSend.sendBigRecordedWorkPoints();
    IoSend.sendRecordedArea();
  });
  socket.on('getIsAutosteerAllowedStatus', () => {
    IoSend.sendIsAutoSteerAllowed(socket);
  });
  socket.on('getIsCurvedRecording', () => {
    IoSend.sendIsCurvedRecording(socket);
  });
  socket.on('getIsWorkRecording', () => {
    IoSend.sendIsWorkRecording(socket);
  });
  socket.on('getSteeringHistory', () => {
    IoSend.sendSteeringHistory(socket);
  });
  socket.on('getCrossTrackDistanceHistory', () => {
    IoSend.sendCrossTrackDistanceHistory(socket);
  });
  socket.on('getRecordedArea', () => {
    IoSend.sendRecordedArea(socket);
  });
});

io.listen(Config.socketIoPort);

if (Config.debug) {
  console.log(`Listening to port ${Config.socketIoPort}`);
}