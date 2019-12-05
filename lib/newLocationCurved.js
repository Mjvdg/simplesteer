"use strict";
const ioSend = require("./socketIO-send");
const State = require('./state');
const CurvedLineRecorder = require('./curvedLineRecorder');
const Calc = require('./Calc');
const CurveddegreesToTurnTracker = require('./curvedDegreesToTurnTracker');
const Autosteer = require('./autosteer');

let previousCurveLocation = { latitude: 0, longitude: 0 };
function newLocationCurved(currentLocation) {
  State.gps.currentLocation = currentLocation;
  ioSend.sendSpeed(State.currentSpeedKmh);
  ioSend.sendCurrentSlope();
  if (State.curvedLines.isRecording
    //&& Calc.distance(currentLocation, previousCurveLocation) > 0.1
  ) {
    CurvedLineRecorder.add([currentLocation.longitude, currentLocation.latitude]);
    State.curvedLines.curvedAbLine = CurvedLineRecorder.get();
    ioSend.sendCurvedLine();
    previousCurveLocation = currentLocation;
  }
  if (State.curvedLines.isRecording === false && State.curvedLines.curvedAbLine.length > 0) {
    CurveddegreesToTurnTracker.update(currentLocation);
    ioSend.sendDegreesToTurn();
    ioSend.sendWheelAndTargetPointLocation();
    if (State.autoSteer) {
      Autosteer.update(currentLocation);
    }
  }
  ioSend.sendMapCurrentLocation();
}

module.exports = newLocationCurved;