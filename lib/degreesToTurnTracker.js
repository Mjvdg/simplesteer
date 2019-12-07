"use strict";
const DB = require('./db/Repo');
const State = require('./state');
const Calc2 = require('./Calc2');
const isYoung = require('./isYoung');

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


    
    const wheelPosition = Calc2.coord(currentLocation, driveBearing, antennaToFrontAxleDistance); // 2 meter vooruit voor wielen
    const TargetPositionCorner = Calc2.coord(currentLocation, driveBearing, wheelToTargetPointDistance + antennaToFrontAxleDistance); // +3 meter vooruit
    const targetCrossTrackDistance = Calc2.getCrossTrackDistance(State.lines.closestLine[0], TargetPositionCorner, State.abLineBearing);
    const theTargetPoint = Calc2.coord(TargetPositionCorner, State.abLineBearing - 90, targetCrossTrackDistance); //kan ook -90 zijn //punt op de closestLine
    State.targetPointLocation = theTargetPoint;
    State.wheelPosition = wheelPosition;
    const wheelToTargetBearing = Calc2.bearing(wheelPosition, theTargetPoint);

 
 
    State.degreesToTurn = Calc2.angleSignedDifference(driveBearing, wheelToTargetBearing);
    historys = historys.filter(isYoung);
    historys.push({ date: new Date(), value: State.degreesToTurn });
  }

  return {
    update,
    getHistorys: () => historys
  }
}());

module.exports = DegreesToTurnTracker;