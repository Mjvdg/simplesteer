"use strict";
const ioSend = require("./socketIO-send");
const State = require('./state');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const DegreesToTurnTracker = require('./degreesToTurnTracker');
const getClosestLineNr = require('./getClosestLineNr');
const Lines = require('./lines');
const Autosteer = require('./autosteer');

let previousClosestLineNr = 0;
function newLocation(currentLocation) {
  State.gps.currentLocation = currentLocation;
  ioSend.sendSpeed(State.currentSpeedKmh);
  ioSend.sendCurrentSlope();
  if( State.pointA.isSet && State.pointB.isSet ){
    let closestLineNr = getClosestLineNr(currentLocation);
    if(closestLineNr != previousClosestLineNr){
      Lines.createAndSend();
      previousClosestLineNr = closestLineNr;
    }
    CrossTrackDistanceTracker.update(currentLocation);
    DegreesToTurnTracker.update(currentLocation);
    ioSend.sendDegreesToTurn();
    ioSend.sendCrossTrackDistance(CrossTrackDistanceTracker.getCrossTrackDistanceWithTime());    
    ioSend.sendWheelAndTargetPointLocation();
    ioSend.sendCurrentLineNumber(closestLineNr);
    if(State.autoSteer){
      Autosteer.update(currentLocation);
    }
  }
  ioSend.sendMapCurrentLocation();
}

module.exports = newLocation;
