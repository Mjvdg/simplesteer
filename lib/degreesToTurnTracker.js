//@ts-check
"use strict";
const DB = require('./db/Repo');
const turf = require('@turf/turf');
const State = require('./state');
const Calc2 = require('./Calc2');
const isYoung = require('./isYoung');
const WheelPosition = require('./wheelPosition');
const Enums = require('./enums');

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
    const antennaToRearAxleDistance = DB.getSettings().machine.antennaToRearAxleDistance;
    let reverseDriveBearing = State.driveBearing - 180;
    const turningRadius = 2;
    let rearwheelPosition = turf.rhumbDestination(currentLocation, antennaToRearAxleDistance / 1000, reverseDriveBearing); // 2 meter achteruit voor wielen
    
    if(Calc2.getCrossTrackDistance(State.lines.closestLine[0], rearwheelPosition, State.abLineBearing) > turningRadius){
      
    }


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