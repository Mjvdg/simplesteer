"use strict";
const sendSVGCurrentLocation = require("./socketIO-send").sendSVGCurrentLocation;
const SpeedTracker = require('./speedTracker');
const ClosestLine = require('./closestLine');
const State = require('./state');
const CrossTrackDistanceTracker = require('./crossTrackDistanceTracker');

function newLocation(currentLocation) {
  State.gps.currentLocation = currentLocation;
  sendSVGCurrentLocation();
  SpeedTracker.update(currentLocation);
  if(State.lines.length > 0){
    ClosestLine.update(currentLocation);
    CrossTrackDistanceTracker.update(currentLocation);
  }
}

module.exports = newLocation;
