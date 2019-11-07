"use strict";
const ioSend = require("./socketIO-send");
const SpeedTracker = require('./speedTracker');
const State = require('./state');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');
const getClosestLineNr = require('./getClosestLineNr');
const CreateAndSendLines = require('./createLines2');


let previousClosestLineNr = 0;
function newLocation(currentLocation) {
  State.gps.currentLocation = currentLocation;
  ioSend.sendMapCurrentLocation();
  SpeedTracker.update(currentLocation);
  if( State.pointA.isSet && State.pointB.isSet ){
    let closestLineNr = getClosestLineNr(currentLocation);
    if(closestLineNr != previousClosestLineNr){
      CreateAndSendLines();
      previousClosestLineNr = closestLineNr;
    }
    CrossTrackDistanceTracker.update(currentLocation);
    ioSend.sendCrossTrackDistance(CrossTrackDistanceTracker.getCrossTrackDistanceWithTime());
    ioSend.sendCurrentLineNumber(closestLineNr);
  }
}

module.exports = newLocation;
