//@ts-check
"use strict";

const ioSend = require("./socketIO-send");
const State = require('./state');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const DegreesToTurnTracker = require('./degreesToTurnTracker');
const getClosestLineNr = require('./getClosestLineNr');
const Lines = require('./lines');
const DB = require('./db/Repo');
const Autosteer = require('./autosteer');
const Calc2 = require('./Calc2');
const CurvedLineRecorder = require('./curvedLineRecorder');
const WheelPosition = require('./wheelPosition');
const WorkRecorder = require('./workRecorder');
const Enums = require('./enums');
let previousClosestLineNr = 0;


const isLocationNotOnTheSamePlace = (() => {
  let previousLocation = [0, 0];
  function isit(location) {
    let response = Calc2.distance(location, previousLocation) > 0.1;
    previousLocation = location;
    return response;
  }
  return {
    isit
  }
})();

function newLocation(currentLocation) {
  State.gps.currentLocation = currentLocation;
  WorkRecorder.updateLocation(currentLocation);
  ioSend.sendSpeed(State.currentSpeedKmh);
  ioSend.sendCurrentSlope();
  WheelPosition.update();
  ioSend.sendWheelPosition();
  let mode = DB.getSettings().mode;
  if (State.pointA.isSet && State.pointB.isSet && (mode === Enums.SteeringMode.straightABlines)) {
    straightLinesReady(currentLocation)
  }
  
  if (mode === Enums.SteeringMode.curvedLines || mode === Enums.SteeringMode.path) {
    if (State.curvedLines.isRecording && isLocationNotOnTheSamePlace.isit(currentLocation)) {
      CurvedLineRecorder.add(currentLocation);
      ioSend.sendCurrentRecordedCurvedAbLine();
    }

    if (!State.curvedLines.isRecording && State.curvedLines.abLine.length > 0) {
      curvedLinesReady(currentLocation);
    }
  }

  ioSend.sendMapCurrentLocation();
}

function curvedLinesReady(currentLocation) {
  let closestLineNr = getClosestLineNr(currentLocation);
  if (closestLineNr != previousClosestLineNr) {
    Lines.createAndSend();
    previousClosestLineNr = closestLineNr;
  }
  DegreesToTurnTracker.update(currentLocation);

  ioSend.sendDegreesToTurn();
  CrossTrackDistanceTracker.update(currentLocation);
  ioSend.sendCrossTrackDistance(CrossTrackDistanceTracker.getCrossTrackDistanceWithTime());
  ioSend.sendTargetPointLocation();

  ioSend.sendCurrentLineNumber(closestLineNr);
  if (State.autoSteer) {
    Autosteer.update();
  }
}

function straightLinesReady(currentLocation) {
  let closestLineNr = getClosestLineNr(currentLocation);
  if (closestLineNr != previousClosestLineNr) {
    Lines.createAndSend();
    previousClosestLineNr = closestLineNr;
  }
  CrossTrackDistanceTracker.update(currentLocation);
  // if(State.gps.isReversing && DB.getSettings().mode === 'straightABlines' && DB.getSettings().machine.isReverseSteeringEnabled){
  //   DegreesToTurnTracker.updateReverse(currentLocation);
  // }else{
    DegreesToTurnTracker.update(currentLocation);
  //}

  ioSend.sendDegreesToTurn();
  ioSend.sendCrossTrackDistance(CrossTrackDistanceTracker.getCrossTrackDistanceWithTime());
  ioSend.sendTargetPointLocation();
  ioSend.sendCurrentLineNumber(closestLineNr);
  if (State.autoSteer) {
    Autosteer.update();
  }
}



module.exports = newLocation;
