"use strict";
const State = require('./state');
const Calc2 = require('./Calc2');
const DB = require('./db/Repo');
const NewLocation = require('./newLocation');

let receiver1 = {};
let receiver2 = {};
function fuseReceiver(nr, receiver) {
  if (nr === 0) {
    receiver1 = receiver;
  }
  if (nr === 1) {
    receiver2 = receiver;
  }
  fuse2();
};

function fuse2() {
  if (receiver1.iTow === receiver2.iTow) {
    State.currentSpeedmms = (receiver1.gSpeed + receiver2.gSpeed) / 2;
    let r1Location = [receiver1.lon, receiver1.lat];
    let r2Location = [receiver2.lon, receiver2.lat];
    let receiverDistance = Calc2.distance(r1Location, r2Location);
    let receiverHeading = Calc2.bearing(r1Location, r2Location);
    let heading = (receiverHeading - 90 + 360) % 360;//kan ook +90 zijn      
    State.driveBearing = heading;
    State.gps.leftLocation = r1Location;
    State.gps.rightLocation = r2Location;
    let heightDifference = receiver1.height / 1000 - receiver2.height / 1000;
    let realReceiverDistance = Math.sqrt(Math.pow(receiverDistance, 2) + Math.pow(heightDifference, 2));
    let slope = -Calc2.radToDeg(Math.atan(heightDifference / realReceiverDistance));
    State.currentSlope = slope;
    let middleLocation = Calc2.coord(r1Location, receiverHeading, receiverDistance / 2);
    let currentCorrectedLocation = correctForSlopeDual(middleLocation, heading, slope);
    NewLocation(currentCorrectedLocation);    
  }
}

function correctForSlopeDual(location, heading, slope) {
  const antennaHeight = DB.getSettings().machine.antennaHeight;
  const y = slope;
  const corrDistance = Math.sin(Calc2.degToRad(y)) * antennaHeight; // overstaande zijde
  // ioRoot.emit('currentSlopeCorrection', corrDistance * 100); // slopeDis
  const correctedLocation = Calc2.coord(location, heading + 90, corrDistance);
  return correctedLocation;
}

module.exports = {
  fuseReceiver
};
