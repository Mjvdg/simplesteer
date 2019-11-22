"use strict";
const State = require('./state');
const Calc = require('./Calc');
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
    let r1Location = { latitude: receiver1.lat, longitude: receiver1.lon };
    let r2Location = { latitude: receiver2.lat, longitude: receiver2.lon };
    let receiverDistance = Calc.distance(r1Location, r2Location);
    let receiverHeading = Calc.bearing(r1Location, r2Location);
    let heading = (receiverHeading - 90 + 360) % 360//kan ook +90 zijn      
    State.driveBearing = heading;
    State.gps.leftLocation = r1Location;
    State.gps.rightLocation = r2Location;
    let heightDifference = receiver1.height / 100 - receiver2.height / 100;
    let realReceiverDistance = Math.sqrt(Math.pow(receiverDistance, 2) + Math.pow(heightDifference, 2));
    let slope = -Calc.radToDeg(Math.atan(heightDifference / realReceiverDistance));
    let middleLocation = Calc.coord(r1Location, receiverHeading, receiverDistance / 2);
    let currentCorrectedLocation = correctForSlopeDual(middleLocation, heading, slope);
    NewLocation(currentCorrectedLocation);
  }
}

function fuse() {
  if (
    receiver1.hasOwnProperty('location') &&
    receiver2.hasOwnProperty('location') &&
    receiver1.dateTime.getTime() === receiver2.dateTime.getTime()
  ) {
    let receiverDistance = Calc.distance(receiver1.location, receiver2.location);
    let receiverHeading = Calc.bearing(receiver1.location, receiver2.location);
    let heading = (receiverHeading - 90 + 360) % 360//kan ook +90 zijn      
    State.driveBearing = heading;
    State.gps.leftLocation = receiver1.location;
    State.gps.rightLocation = receiver2.location;
    let heightDifference = receiver1.height - receiver2.height;
    let realReceiverDistance = Math.sqrt(Math.pow(receiverDistance, 2) + Math.pow(heightDifference, 2));
    let slope = -Calc.radToDeg(Math.atan(heightDifference / realReceiverDistance));
    let middleLocation = Calc.coord(receiver1.location, receiverHeading, receiverDistance / 2);
    let currentCorrectedLocation = correctForSlopeDual(middleLocation, heading, slope);
    NewLocation(currentCorrectedLocation);
  }
}


function correctForSlopeDual(location, heading, slope) {
  const antennaHeight = DB.getSettings().machine.antennaHeight;
  const y = slope;
  const corrDistance = Math.sin(Calc.degToRad(y)) * antennaHeight; // overstaande zijde
  // ioRoot.emit('currentSlopeCorrection', corrDistance * 100); // slopeDis
  const correctedLocation = Calc.coord(location, heading + 90, corrDistance);
  return correctedLocation;
}

module.exports = {
  fuse,
  fuseReceiver
};


