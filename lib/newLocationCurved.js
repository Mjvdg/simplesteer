"use strict";
const ioSend = require("./socketIO-send");
const State = require('./state');
const CurvedLineRecorder = require('./curvedLineRecorder');
const Calc = require('./Calc');
const CurveddegreesToTurnTracker = require('./curvedDegreesToTurnTracker');
const Autosteer = require('./autosteer');
const getClosestCurvedLineNr = require('./getClosestCurveLineNr');
const Lines = require('./lines');

let previousCurveLocation = { latitude: 0, longitude: 0 };
let previousClosestLineNr = 0;
function newLocationCurved(currentLocation) {
  State.gps.currentLocation = currentLocation;
  ioSend.sendSpeed(State.currentSpeedKmh);
  ioSend.sendCurrentSlope();
  if (State.curvedLines.isRecording
    && Calc.distance(currentLocation, previousCurveLocation) > 0.1
  ) {
    CurvedLineRecorder.add([currentLocation.longitude, currentLocation.latitude]);
    ioSend.sendCurrentRecordedCurvedAbLine();
    previousCurveLocation = currentLocation;
  }
  if (!State.curvedLines.isRecording && CurvedLineRecorder.get().length > 0) {
    let closestLineNr = getClosestCurvedLineNr([currentLocation.longitude, currentLocation.latitude]);
    if(closestLineNr != previousClosestLineNr){
      Lines.createAndSend();
      previousClosestLineNr = closestLineNr;
    }
    CurveddegreesToTurnTracker.update(currentLocation);
    ioSend.sendCurrentLineNumber(closestLineNr);
    ioSend.sendDegreesToTurn();
    ioSend.sendWheelAndTargetPointLocation();
    if (State.autoSteer) {
      Autosteer.update(currentLocation);
    }
  }
  ioSend.sendMapCurrentLocation();
}

module.exports = newLocationCurved;