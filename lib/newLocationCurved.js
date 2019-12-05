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
  if (State.pointA.isSet &&
    !State.pointB.isSet
    //&& Calc.distance(currentLocation, previousCurveLocation) > 0.1
  ) {
    CurvedLineRecorder.add([currentLocation.longitude, currentLocation.latitude]);
    State.lines.curvedAbLine = CurvedLineRecorder.get();
    ioSend.sendCurvedLine();
    previousCurveLocation = currentLocation;
  }
  if (State.pointA.isSet && State.pointB.isSet) {
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