"use strict";
const State = require('./state');
const Calc = require('./Calc');
const DB = require('./db/Repo')
const NewLocation = require('./newLocation');

  let receiver1 = {};
  let receiver2 = {};
  function fuseReceiver(nr, receiver){
    if(nr === 0){
      receiver1 = receiver;
    }
    if(nr === 1){
      receiver2 = receiver;
    }
    fuse();
  };

  function fuse(){
    if (
      receiver1.hasOwnProperty('location') && 
      receiver2.hasOwnProperty('location') && 
      receiver1.dateTime.getTime() === receiver2.dateTime.getTime()
    ){
      let receiverDistance = Calc.distance(receiver1.location, receiver2.location);
      let receiverHeading = Calc.bearing(receiver1.location, receiver2.location);
      let heading = (receiverHeading - 90 + 360) % 360//kan ook +90 zijn      
      State.driveBearing = heading;
      let heightDifference = receiver1.height - receiver2.height;
      let realReceiverDistance = Math.sqrt(Math.pow(receiverDistance, 2) + Math.pow(heightDifference, 2));
      let slope = -Calc.radToDeg(Math.atan(heightDifference / realReceiverDistance));
      let middleLocation = Calc.coord(receiver1.location, receiverHeading, receiverDistance / 2);
      let currentCorrectedLocation = correctForSlopeDual(middleLocation, heading, slope);
      NewLocation(currentCorrectedLocation);
    }
  }


function correctForSlopeDual(location, heading, slope){
  const antennaHeight = DB.getSettings().antennaHeight;
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


