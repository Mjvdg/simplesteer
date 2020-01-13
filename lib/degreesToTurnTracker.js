//@ts-check
"use strict";
const DB = require('./db/Repo');
const turf = require('@turf/turf');
const State = require('./state');
const Calc2 = require('./Calc2');
const isYoung = require('./isYoung');
const WheelPosition = require('./wheelPosition');
const Enums = require('./enums');
const Tractor = require('./jetzeReverse').Tractor;
const TargetLine  = require('./jetzeReverse').TargetLine;
const DegreesToTurnTracker = (function () {
  let historys = [];
  function update(currentLocation) {
    const antennaToFrontAxleDistance = DB.getSettings().machine.antennaToFrontAxleDistance
    const { timeAheadSeconds, minimumDistance } = DB.getSettings().targetPoint;
    let driveBearing = State.driveBearing;
    let wheelToTargetPointDistance = State.currentSpeedKmh * 1000 / 60 / 60 * timeAheadSeconds;
    if (wheelToTargetPointDistance < minimumDistance) {
      wheelToTargetPointDistance = minimumDistance;
    }

    let wheelToTargetBearing;
    
    if (DB.getSettings().mode === Enums.SteeringMode.straightABlines) {
      const TargetPositionCorner = Calc2.coord(currentLocation, driveBearing, wheelToTargetPointDistance + antennaToFrontAxleDistance); // +3 meter vooruit
      const targetCrossTrackDistance = Calc2.getCrossTrackDistance(State.lines.closestLine[0], TargetPositionCorner, State.abLineBearing);
      const theTargetPoint = Calc2.coord(TargetPositionCorner, State.abLineBearing - 90, targetCrossTrackDistance); //kan ook -90 zijn //punt op de closestLine
      State.targetPointLocation = theTargetPoint;
      wheelToTargetBearing = Calc2.bearing(WheelPosition.get(), theTargetPoint);
    }
    if (DB.getSettings().mode === Enums.SteeringMode.curvedLines || DB.getSettings().mode === Enums.SteeringMode.path) {
      const targetPositionCorner = turf.rhumbDestination(currentLocation, antennaToFrontAxleDistance / 1000 + wheelToTargetPointDistance / 1000, driveBearing);
      const targetPoint = turf.nearestPointOnLine(turf.lineString(State.curvedLines.closestLine), targetPositionCorner);
      State.targetPointLocation = targetPoint.geometry.coordinates;
      wheelToTargetBearing = turf.bearing(WheelPosition.getTurf(), targetPoint);
    }
    
    State.degreesToTurn = Calc2.angleSignedDifference(driveBearing, wheelToTargetBearing);
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: State.degreesToTurn });
  }

  function updateReverse(currentLocation){
    
    //target line
    const pointA = State.lines.closestLine[0]; //[longitude, latitude] 
    const pointB = State.lines.closestLine[1]; //[longitude, latitude]
    
    const maxSteeringAngle = DB.getSettings().machine.maxSteeringAngle; //in degrees

    var tractor    = new Tractor(currentLocation, -State.driveBearing);
    let targetLine = new TargetLine(pointA, pointB, tractor);
    // Determine if the tractor is too close or too far.
    let toClose   = targetLine.tractorToClose();
    let toFar     = targetLine.tractorToFar();
    // Determine whether to steer left or right
    let turnAngle = targetLine.tractorTurnDirection(toClose, toFar)*maxSteeringAngle;
    // Correction for distance to line and speed.
    turnAngle = turnAngle*(targetLine.alignmentFactor()*targetLine.speedFactor());
    // console.log('toFar', toFar);
    // console.log('toClose', toClose)
    // console.log('turnAngle', turnAngle)
    State.degreesToTurn = turnAngle
  }

  function clear(){
    historys = [];
  }
  return {
    update,
    updateReverse,
    getHistorys: () => historys,
    clear
  }
}());

module.exports = DegreesToTurnTracker;